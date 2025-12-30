const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyC_3EZ9Re6mwvdx1G6RJIlT803GOzQ4VgrhuV6eyIhhohgX6dHJhHeTrZ4u4qeAWBc/exec';

let db = { respostas: [], contextos: [], glossario: [] };
let contextoAtual = "saudação";

window.onload = () => {
    loadData();
    // Garante que o botão Enviar e a tecla Enter funcionem
    document.getElementById("send-btn").addEventListener("click", sendMessage);
    document.getElementById("user-input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
};

async function loadData() {
    try {
        const r = await fetch(APPS_SCRIPT_URL);
        db = await r.json();
        console.log("Inteligência iGreen carregada. Contexto inicial: saudação");
    } catch (e) { console.error("Erro ao conectar com a planilha."); }
}

function sendMessage() {
    const input = document.getElementById("user-input");
    const val = input.value.trim();
    if (!val) return;
    addMessageToChat(val, "user");
    input.value = "";
    processLogic(val);
}

function processLogic(userInput) {
    const textoLimpo = normalizar(userInput);

    // 1. TRADUÇÃO DE SINÔNIMOS (Baseado no contexto atual)
    let textoProcessado = textoLimpo;
    db.glossario.forEach(g => {
        if (g.contexto.toLowerCase() === contextoAtual || g.contexto.toLowerCase() === "geral") {
            const listaSinonimos = g.sinonimos.split(",").map(s => s.trim());
            listaSinonimos.forEach(sin => {
                if (textoLimpo.includes(sin) && sin.length > 0) {
                    // Substitui o sinônimo pela palavra principal para facilitar o match
                    textoProcessado = textoProcessado.replace(sin, g.palavra.toLowerCase());
                }
            });
        }
    });

    // 2. INFERÊNCIA DE CONTEXTO (Página 2)
    // Se o bot detectar palavras de outro contexto, ele muda o contexto da conversa
    let novoContextoDetectado = contextoAtual;
    let maxContextScore = 0;

    db.contextos.forEach(c => {
        let score = 0;
        const keys = c.keywords.split(",").map(k => k.trim());
        keys.forEach(k => {
            if (textoProcessado.includes(k)) score++;
        });

        if (score > maxContextScore) {
            maxContextScore = score;
            novoContextoDetectado = c.contexto.toLowerCase();
        }
    });

    contextoAtual = novoContextoDetectado;
    console.log("Contexto definido como:", contextoAtual);

    // 3. BUSCA DE RESPOSTA (Página 1)
    // Filtra apenas respostas do contexto atual
    const respostasPossiveis = db.respostas.filter(r => r.contexto.toLowerCase() === contextoAtual);
    
    let melhorResposta = null;
    let maxPalavrasIguais = -1;

    respostasPossiveis.forEach(r => {
        const palavrasPergunta = normalizar(r.pergunta).split(/\s+/);
        let coincidencias = 0;
        
        palavrasPergunta.forEach(p => {
            if (textoProcessado.includes(p)) coincidencias++;
        });

        if (coincidencias > maxPalavrasIguais) {
            maxPalavrasIguais = coincidencias;
            melhorResposta = r;
        }
    });

    // 4. RESPOSTA FINAL
    if (melhorResposta && maxPalavrasIguais > 0) {
        addMessageToChat(melhorResposta.resposta, "bot");
    } else {
        addMessageToChat("Desculpe, não consegui encontrar uma informação exata sobre isso no assunto '" + contextoAtual + "'. Pode tentar falar de outra forma?", "bot");
    }
}

function normalizar(t) {
    return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
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
