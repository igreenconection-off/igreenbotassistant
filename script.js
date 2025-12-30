// *** SUBSTITUA PELA SUA URL DO GOOGLE APPS SCRIPT ***
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby0QptxzM2c0CckHUf2Y6tkWy6NxBnHWukrTlKCCfXUFrJIhOy1TLXvEK_BB-vdPE19/exec';

let knowledgeBase = []; // Armazena os dados da planilha
let isLearningMode = false; // Controla se o bot está esperando o usuário ensinar
let questionBeingLearned = ""; // Guarda a pergunta que o bot não sabia

// Carrega os dados assim que abre a página
window.onload = function() {
    fetch(APPS_SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            knowledgeBase = data;
            console.log("Base de conhecimento carregada!", knowledgeBase);
        })
        .catch(error => console.error("Erro ao carregar dados:", error));
};

// Detecta o "Enter" no teclado
document.getElementById("user-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    const inputField = document.getElementById("user-input");
    const message = inputField.value.trim();

    if (message === "") return;

    // 1. Mostra mensagem do usuário
    addMessageToChat(message, "user");
    inputField.value = "";

    // Efeito de "digitando..."
    setTimeout(() => {
        processMessage(message);
    }, 600); // Pequeno delay para parecer natural
}

function processMessage(userText) {
    // 2. MODO APRENDIZADO (Se o bot perguntou antes)
    if (isLearningMode) {
        saveNewKnowledge(questionBeingLearned, userText);
        return;
    }

    // 3. MODO BUSCA
    // Normaliza o texto (remove acentos e põe minúsculo)
    const normalizedText = userText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    let bestMatch = null;
    let highestScore = 0;

    // Procura na base de dados
    knowledgeBase.forEach(entry => {
        let score = 0;
        // Verifica palavras-chave
        if (entry.keywords) {
            const keywords = entry.keywords.split(",").map(k => k.trim());
            keywords.forEach(word => {
                if (normalizedText.includes(word) && word.length > 2) {
                    score++;
                }
            });
        }
        // Verifica na pergunta original também
        if (entry.pergunta && entry.pergunta.toLowerCase().includes(normalizedText)) {
            score += 2; // Peso maior se bater com a pergunta
        }

        if (score > highestScore) {
            highestScore = score;
            bestMatch = entry;
        }
    });

    // 4. RESPOSTA
    if (bestMatch && highestScore > 0) {
        addMessageToChat(bestMatch.resposta, "bot");
    } else {
        // Não encontrou? Entra no modo de aprendizado
        isLearningMode = true;
        questionBeingLearned = userText;
        addMessageToChat("Humm, ainda não aprendi sobre isso. Mas sou rápido! Se você souber a resposta, me conta aqui embaixo que eu guardo na minha memória.", "bot");
    }
}

function saveNewKnowledge(pergunta, resposta) {
    addMessageToChat("Obrigado! Estou guardando essa informação...", "bot");

    // Envia para o Google Sheets via POST
    // Usamos um truque com 'fetch' para enviar os dados
    const url = `${APPS_SCRIPT_URL}?action=save&pergunta=${encodeURIComponent(pergunta)}&resposta=${encodeURIComponent(resposta)}`;
    
    fetch(url, { method: "POST" })
    .then(() => {
        addMessageToChat("Prontinho! Aprendi. Pode me perguntar de novo se quiser testar.", "bot");
        
        // Atualiza a memória local sem precisar recarregar a página
        knowledgeBase.push({
            pergunta: pergunta,
            resposta: resposta,
            keywords: pergunta.toLowerCase()
        });
        
        // Reseta as variáveis
        isLearningMode = false;
        questionBeingLearned = "";
    })
    .catch(() => {
        addMessageToChat("Ops, tive um problema para salvar na minha planilha. Tente novamente mais tarde.", "bot");
        isLearningMode = false;
    });
}

function addMessageToChat(text, sender) {
    const chatContainer = document.getElementById("chat-container");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");

    let avatarHTML = "";
    if (sender === "bot") {
        avatarHTML = `<img src="https://c.topshort.org/aifacefy/ai_face_generator/template/1.webp" class="msg-avatar">`;
    }

    messageDiv.innerHTML = `${avatarHTML}<div class="bubble">${text}</div>`;
    chatContainer.appendChild(messageDiv);
    
    // Rola para o final
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
