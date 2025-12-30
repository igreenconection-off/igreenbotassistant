const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwlssLoEsrUQOoNogC-zv29uujWUnV-bV0D-g-OXRxpWWeUmsbrIjAetUVuTW5HjA33/exec'; // <--- Verifique se a URL termina em /exec

let dbRespostas = [];
let dbGlossario = [];
let contextoAtual = "geral";

window.onload = () => {
    loadData();
    document.getElementById("send-btn").onclick = sendMessage;
};

// Carrega os dados do Google Sheets
async function loadData() {
    try {
        const r = await fetch(APPS_SCRIPT_URL);
        const data = await r.json();
        dbRespostas = data.respostas;
        dbGlossario = data.glossario;
        console.log("Sistema de Inteligência Conectado com Sucesso.");
    } catch (e) { 
        console.error("Erro ao conectar com a planilha. Verifique a URL."); 
    }
}

function sendMessage() {
    const input = document.getElementById("user-input");
    const val = input.value.trim();
    if (!val) return;
    
    addMessageToChat(val, "user");
    input.value = "";
    
    // Pequeno delay para simular pensamento
    setTimeout(() => processLogic(val), 600);
}

function processLogic(text) {
    const inputNormalizado = normalizarTexto(text);
    
    // 1. EXPANSÃO POR SINÔNIMOS (Glossário)
    let termosDeBusca = [inputNormalizado];
    
    dbGlossario.forEach(item => {
        const sinonimos = item.sinonimos.toString().toLowerCase().split(",").map(s => s.trim());
        const contextosDoSinonimo = item.contexto.toString().toLowerCase().split(",").map(c => c.trim());

        // Se o usuário usou um sinônimo que pertence ao contexto atual ou ao geral
        sinonimos.forEach(s => {
            if (inputNormalizado.includes(s)) {
                if (contextosDoSinonimo.includes(contextoAtual) || contextosDoSinonimo.includes("geral")) {
                    termosDeBusca.push(item.palavra.toLowerCase());
                }
            }
        });
    });

    const textoFinalParaBusca = termosDeBusca.join(" ");

    // 2. BUSCA POR PONTUAÇÃO
    let melhorMatch = null;
    let maiorScore = 0;

    dbRespostas.forEach(item => {
        let score = 0;
        const keywords = item.keywords.toString().toLowerCase().split(",").map(k => k.trim());
        const perguntaPlanilha = item.pergunta.toString().toLowerCase();
        const contextoItem = item.contexto.toString().toLowerCase().trim();

        // Bonus por Contexto (Ajuda a desempatar)
        if (contextoItem === contextoAtual) score += 2;

        // Pontuação por palavras-chave
        keywords.forEach(key => {
            if (textoFinalParaBusca.includes(key) && key.length > 1) {
                score += 5;
            }
        });

        // Pontuação por frase exata
        if (inputNormalizado.includes(perguntaPlanilha) || perguntaPlanilha.includes(inputNormalizado)) {
            score += 10;
        }

        if (score > maiorScore) {
            maiorScore = score;
            melhorMatch = item;
        }
    });

    // 3. RESPOSTA FINAL
    if (melhorMatch && maiorScore >= 5) {
        addMessageToChat(melhorMatch.resposta, "bot");
        // Atualiza o contexto para a próxima pergunta
        contextoAtual = melhorMatch.contexto.toLowerCase();
    } else {
        addMessageToChat("Desculpe, ainda não tenho informações sobre isso. Poderia tentar perguntar de outra forma ou falar sobre outro assunto?", "bot");
    }
}

function normalizarTexto(t) {
    return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
