// *** SUBSTITUA PELA SUA URL DO GOOGLE APPS SCRIPT ***
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby0QptxzM2c0CckHUf2Y6tkWy6NxBnHWukrTlKCCfXUFrJIhOy1TLXvEK_BB-vdPE19/exec'; 

let knowledgeBase = [];
let isLearningMode = false;
let questionBeingLearned = "";

window.onload = function() {
    fetch(APPS_SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            knowledgeBase = data;
            console.log("Base carregada:", knowledgeBase);
        })
        .catch(error => console.error("Erro ao carregar:", error));
        
    // CORREÇÃO 1: Adicionando o evento de clique no botão via JS para funcionar no PC
    document.getElementById("send-btn").addEventListener("click", sendMessage);
};

document.getElementById("user-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    const inputField = document.getElementById("user-input");
    const message = inputField.value.trim();

    if (message === "") return;

    addMessageToChat(message, "user");
    inputField.value = "";

    setTimeout(() => {
        processMessage(message);
    }, 600);
}

function processMessage(userText) {
    if (isLearningMode) {
        saveNewKnowledge(questionBeingLearned, userText);
        return;
    }

    const normalizedText = userText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    let bestMatch = null;
    let highestScore = 0;

    knowledgeBase.forEach(entry => {
        let score = 0;
        
        // CORREÇÃO 2: Verificando palavras-chave
        if (entry.keywords) {
            // Se as keywords forem número ou data na planilha, converte para string
            let strKeywords = entry.keywords.toString().toLowerCase();
            const keywords = strKeywords.split(",").map(k => k.trim());
            
            keywords.forEach(word => {
                // MUDANÇA AQUI: Alterado de > 2 para >= 2 para aceitar "Oi"
                if (normalizedText.includes(word) && word.length >= 2) {
                    score++;
                }
            });
        }
        
        // Verifica pergunta exata ou parcial
        if (entry.pergunta && entry.pergunta.toString().toLowerCase().includes(normalizedText)) {
            score += 3; // Aumentei o peso se a frase for parecida com a pergunta inteira
        }

        if (score > highestScore) {
            highestScore = score;
            bestMatch = entry;
        }
    });

    if (bestMatch && highestScore > 0) {
        addMessageToChat(bestMatch.resposta, "bot");
    } else {
        isLearningMode = true;
        questionBeingLearned = userText;
        addMessageToChat("Humm, ainda não aprendi isso. Se você souber a resposta, me ensine enviando a resposta correta abaixo.", "bot");
    }
}

function saveNewKnowledge(pergunta, resposta) {
    addMessageToChat("Obrigado! Estou guardando essa informação...", "bot");

    // CORREÇÃO 3: Removendo o método POST. 
    // Vamos enviar tudo via URL (GET) para evitar bloqueio de CORS do Google.
    // O Apps Script vai receber isso no doGet e processar igual.
    const url = `${APPS_SCRIPT_URL}?action=save&pergunta=${encodeURIComponent(pergunta)}&resposta=${encodeURIComponent(resposta)}`;
    
    // Removemos { method: "POST" }
    fetch(url)
    .then(response => {
        // Se a resposta chegou aqui, deu certo
        addMessageToChat("Prontinho! Aprendi. Pode testar perguntando de novo.", "bot");
        
        // Atualiza a memória local
        knowledgeBase.push({
            pergunta: pergunta,
            resposta: resposta,
            keywords: pergunta.toLowerCase() + ", " + resposta.toLowerCase() // Adiciona resposta nas keywords pra ajudar na busca futura
        });
        
        isLearningMode = false;
        questionBeingLearned = "";
    })
    .catch(error => {
        console.error("Erro detalhado:", error);
        // Mesmo com erro de rede aparente, às vezes o Google salva.
        // Mas vamos avisar o usuário para tentar de novo.
        addMessageToChat("Tive um probleminha de conexão, mas tentei anotar.", "bot");
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
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
