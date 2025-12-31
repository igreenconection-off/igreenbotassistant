// CONFIGURAÇÃO: Substitua pela sua chave do Google AI Studio
const API_KEY = 'AIzaSyABq8rgWLgxbFfG6p9dnyBsqgxma4NUUZQ'; 
const MODELO = 'gemini-1.5-flash';

// Dados extraídos do seu PDF para alimentar a inteligência da IA
const CONTEXTO_EMPRESA = `
Você é a Assistente IA da iGreen Energy. Seu público são idosos, use linguagem simples.
INFORMAÇÕES DA EMPRESA:
- [cite_start]Conexão Green: Portabilidade de energia solar com desconto de até 15% na fatura[cite: 5, 6]. 
- Requisitos: Consumo mín. [cite_start]130kWh (aprox. R$150), ser titular, não ter baixa renda/NIS, não ter placa solar e estar em dia[cite: 11, 12, 13, 14, 15].
- [cite_start]Prazos: Até 90 dias para aprovação[cite: 22]. [cite_start]Se atrasar documentos, tem 30 dias para reenviar[cite: 18].
- [cite_start]Produtos: Conexão Green, Solar (aluguel de telhado), Placas (venda), Livre (empresas), Telecom (internet 5G) e Expansão (franquia)[cite: 4, 36, 43, 46, 47, 54].
- [cite_start]Suporte: WhatsApp wa.me/5584920039738 e Cancelamento 0800 000 6227[cite: 3, 25].
`;

window.onload = () => {
    document.getElementById("send-btn").addEventListener("click", sendMessage);
    document.getElementById("user-input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
};

async function sendMessage() {
    const input = document.getElementById("user-input");
    const userText = input.value.trim();
    if (!userText) return;

    addMessageToChat(userText, "user");
    input.value = "";

    const typingId = "typing-" + Date.now();
    addMessageToChat("Analisando...", "bot", typingId);

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: `Instruções: ${CONTEXTO_EMPRESA}\n\nPergunta do Cliente: ${userText}` }]
                }],
                generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.7
                }
            })
        });

        const data = await response.json();
        
        // Verifica se a API retornou erro de segurança ou chave
        if (data.error) {
            throw new Error(data.error.message);
        }

        const botResponse = data.candidates[0].content.parts[0].text;
        document.getElementById(typingId).remove();
        addMessageToChat(botResponse, "bot");

    } catch (error) {
        console.error("Erro detalhado:", error);
        document.getElementById(typingId).innerHTML = `<div class='bubble'>Infelizmente tive um erro técnico. Verifique se a sua chave API está correta ou tente novamente.</div>`;
    }
}

function addMessageToChat(text, sender, id = null) {
    const container = document.getElementById("chat-container");
    const div = document.createElement("div");
    div.className = `message ${sender}-message`;
    if (id) div.id = id;
    const avatar = sender === "bot" ? `<img src="https://c.topshort.org/aifacefy/ai_face_generator/template/1.webp" class="msg-avatar">` : "";
    div.innerHTML = `${avatar}<div class="bubble">${text}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}
