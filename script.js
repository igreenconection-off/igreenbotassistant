const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwlssLoEsrUQOoNogC-zv29uujWUnV-bV0D-g-OXRxpWWeUmsbrIjAetUVuTW5HjA33/exec';

let dbRespostas = [];
let dbGlossario = [];
let contextoAtual = "geral"; // Contexto inicial
let isLearningMode = false;
let lastUserMessage = "";

window.onload = () => {
    loadData();
    document.getElementById("send-btn").onclick = sendMessage;
};

async function loadData() {
    try {
        const r = await fetch(APPS_SCRIPT_URL);
        const data = await r.json();
        dbRespostas = data.respostas;
        dbGlossario = data.glossario;
        console.log("Sistema de Inteligência Carregado.");
    } catch (e) { console.error("Erro ao carregar banco."); }
}

function sendMessage() {
    const input = document.getElementById("user-input");
    const val = input.value.trim();
    if (!val) return;
    addMessageToChat(val, "user");
    input.value = "";
    processLogic(val);
}

function processLogic(text) {
    if (isLearningMode) {
        saveNewKnowledge(lastUserMessage, text);
        return;
    }

    const inputNormalizado = normalizarTexto(text);
    
    // 1. TRADUÇÃO POR SINÔNIMOS (O pulo do gato)
    // O bot percorre o glossário e vê se algum sinônimo bate com o contexto atual
    let palavrasProcessadas = inputNormalizado.split(" ");
    dbGlossario.forEach(item => {
        const sinonimos = item.sinonimos.toString().toLowerCase().split(",").map(s => s.trim());
        const contextosPermitidos = item.contexto.toString().toLowerCase().split(",").map(c => c.trim());

        // Se o contexto do glossário bate com o contexto atual (ou é geral)
        if (contextosPermitidos.includes(contextoAtual) || contextosPermitidos.includes("geral")) {
            sinonimos.forEach(s => {
                if (inputNormalizado.includes(s)) {
                    // Substitui o sinônimo pela palavra-mestre no texto de busca
                    palavrasProcessadas.push(item.palavra.toLowerCase());
                }
            });
        }
    });

    const textoFinalParaBusca = palavrasProcessadas.join(" ");

    // 2. BUSCA POR PONTUAÇÃO E CONTEXTO
    let melhorResposta = null;
    let maiorPontuacao = 0;

    dbRespostas.forEach(item => {
        let score = 0;
        const ctxItem = item.contexto.toLowerCase();
        const keywords = item.keywords.toLowerCase().split(",");

        // Peso 1: Bater o contexto atual (Filtro)
        if (ctxItem === contextoAtual) score += 5;

        // Peso 2: Quantidade de palavras-chave encontradas
        keywords.forEach(key => {
            if (textoFinalParaBusca.includes(key.trim())) score += 3;
        });

        // Peso 3: Semelhança direta
        if (textoFinalParaBusca.includes(item.pergunta.toLowerCase())) score += 10;

        if (score > maiorPontuacao) {
            maiorPontuacao = score;
            melhorResposta = item;
        }
    });

    // 3. DECISÃO
    if (melhorResposta && maiorPontuacao > 8) { // Threshold de confiança
        addMessageToChat(melhorResposta.resposta, "bot");
        contextoAtual = melhorResposta.contexto; // O bot muda o contexto baseado na resposta dada
    } else {
        isLearningMode = true;
        lastUserMessage = text;
        addMessageToChat("Humm, entendi o que disse, mas não tenho certeza sobre isso no contexto de " + contextoAtual + ". Como eu deveria responder?", "bot");
    }
}

function normalizarTexto(t) {
    return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function saveNewKnowledge(pergunta, resposta) {
    addMessageToChat("Aprendendo...", "bot");
    // Ao salvar, ele herda o contexto da conversa atual
    const url = `${APPS_SCRIPT_URL}?action=save&pergunta=${encodeURIComponent(pergunta)}&resposta=${encodeURIComponent(resposta)}&contexto=${contextoAtual}&keywords=${encodeURIComponent(pergunta.toLowerCase())}`;
    
    await fetch(url, { mode: 'no-cors' });
    addMessageToChat("Obrigado! Guardei isso no meu conhecimento sobre " + contextoAtual, "bot");
    isLearningMode = false;
    loadData();
}

function addMessageToChat(text, sender) {
    const container = document.getElementById("chat-container");
    const div = document.createElement("div");
    div.className = `message ${sender}-message`;
    const avatar = sender === "bot" ? `<img src="https://c.topshort.org/aifacefy/ai_face_generator/template/1.webp" class="msg-avatar">` : "";
    div.innerHTML = `${avatar}<div class="bubble">${text}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}
