// CONFIGURAÇÃO: Substitua pela sua chave do Google AI Studio
const API_KEY = 'AIzaSyABq8rgWLgxbFfG6p9dnyBsqgxma4NUUZQ'; 
const MODELO = 'gemini-1.5-flash'; // Modelo rápido e eficiente

// Aqui você define a "Personalidade" da IA (o que estava no seu arquivo de texto)
const SYSTEM_PROMPT = `Você é a Assistente IA da iGreen Energy. 
Seu público-alvo são idosos, então use linguagem simples, clara e respeitosa. 
Nunca seja técnica demais. Seja descontraída e leve.
Baseie suas respostas nestas informações da empresa: A iGreen Energy é uma empresa focada em soluções de sustentabilidade e economia, oferecendo uma variedade de serviços que abrangem energia renovável, telecomunicações e oportunidades de empreendedorismo.`;

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

    // Exibe mensagem do usuário
    addMessageToChat(userText, "user");
    input.value = "";

    // Mostra um "pensando..." temporário
    const typingId = "typing-" + Date.now();
    addMessageToChat("Digitando...", "bot", typingId);

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${SYSTEM_PROMPT}\n\nPergunta do cliente: ${userText}` }]
                }]
            })
        });

        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;

        // Remove o "digitando" e coloca a resposta real
        document.getElementById(typingId).remove();
        addMessageToChat(botResponse, "bot");

    } catch (error) {
        console.error("Erro na API:", error);
        document.getElementById(typingId).innerHTML = "<div class='bubble'>Ops! Tive um probleminha de conexão. Pode repetir?</div>";
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
