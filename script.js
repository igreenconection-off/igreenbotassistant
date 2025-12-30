const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwlssLoEsrUQOoNogC-zv29uujWUnV-bV0D-g-OXRxpWWeUmsbrIjAetUVuTW5HjA33/exec';

let dbRespostas = [];
let dbGlossario = [];
let contextoAtual = "geral"; 
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
        console.log("Sistema de Inteligência Conectado.");
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
    let palavrasDoUsuario = inputNormalizado.split(/\s+/);
    
    // 1. EXPANSÃO POR SINÔNIMOS
    // Adicionamos as "palavras-mestre" ao que o usuário disse baseado no glossário
    let termosExpandidos = [...palavrasDoUsuario];
    dbGlossario.forEach(item => {
        const sinonimos = item.sinonimos.toString().toLowerCase().split(",").map(s => s.trim());
        const contextosDoSinonimo = item.contexto.toString().toLowerCase().split(",").map(c => c.trim());

        // Se o usuário usou um sinônimo, adicionamos a palavra principal à busca
        sinonimos.forEach(s => {
            if (inputNormalizado.includes(s)) {
                termosExpandidos.push(item.palavra.toLowerCase());
                // Se o sinônimo tem um contexto forte, isso ajuda a mudar o contexto
                if (!contextosDoSinonimo.includes("geral")) {
                    contextoAtual = contextosDoSinonimo[0]; 
                }
            }
        });
    });

    const buscaFinal = termosExpandidos.join(" ");

    // 2. BUSCA ROBUSTA (Pontuação por Relevância)
    let melhorMatch = null;
    let maiorScore = 0;

    dbRespostas.forEach(item => {
        let score = 0;
        const ctxItem = item.contexto.toLowerCase().trim();
        const keywords = item.keywords.toLowerCase().split(",").map(k => k.trim());
        const perguntaItem = item.pergunta.toLowerCase();

        // Bonus por Contexto (Se for o contexto atual, ganha vantagem, mas não é obrigatório)
        if (ctxItem === contextoAtual) score += 3;

        // Pontos por palavras-chave (O coração da lógica)
        keywords.forEach(key => {
            if (buscaFinal.includes(key) && key.length > 1) {
                score += 5; // Cada palavra-chave encontrada vale muito
            }
        });

        // Pontos por similaridade da frase
        if (buscaFinal.includes(perguntaItem) || perguntaItem.includes(inputNormalizado)) {
            score += 10;
        }

        if (score > maiorScore) {
            maiorScore = score;
            melhorMatch = item;
        }
    });

    // 3. DECISÃO E MUDANÇA DE CONTEXTO
    // Aumentamos o threshold para 5 para evitar respostas aleatórias
    if (melhorMatch && maiorScore >= 5) {
        addMessageToChat(melhorMatch.resposta, "bot");
        
        // Se a resposta encontrada pertence a outro contexto, o bot "muda de assunto"
        if (melhorMatch.contexto.toLowerCase() !== contextoAtual) {
            console.log("Mudando contexto para: " + melhorMatch.contexto);
            contextoAtual = melhorMatch.contexto.toLowerCase();
        }
    } else {
        isLearningMode = true;
        lastUserMessage = text;
        addMessageToChat("Humm, não tenho certeza se entendi. Isso tem a ver com " + contextoAtual + " ou é outro assunto? Se puder, me explique melhor para eu aprender!", "bot");
    }
}

function normalizarTexto(t) {
    return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function saveNewKnowledge(pergunta, resposta) {
    addMessageToChat("Entendi! Vou guardar isso...", "bot");
    
    // Tenta adivinhar o contexto para salvar
    const url = `${APPS_SCRIPT_URL}?action=save&pergunta=${encodeURIComponent(pergunta)}&resposta=${encodeURIComponent(resposta)}&contexto=${contextoAtual}&keywords=${encodeURIComponent(pergunta.toLowerCase())}`;
    
    try {
        await fetch(url, { mode: 'no-cors' });
        addMessageToChat("Prontinho! Aprendi que no contexto de " + contextoAtual + " a resposta é essa. Obrigado!", "bot");
        isLearningMode = false;
        loadData();
    } catch (e) {
        isLearningMode = false;
    }
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
