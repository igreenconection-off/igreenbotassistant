// CONFIGURAÇÃO
const API_KEY = 'AIzaSyABq8rgWLgxbFfG6p9dnyBsqgxma4NUUZQ'; // Substitua pela sua chave real
const MODELO = 'gemini-1.5-flash';

const BANCO_DE_DADOS_TEXTO = `Este documento reúne informações básicas dos produtos oferecidos pela igreen Energy.
Insumos extra:
Site: igreenconection-off.github.io/IGREENCONECTION
Atendimento por whatsapp: wa.me/5584920039738 
Os produtos ofertados são: Conexão Green (o carro chefe), conexão placas, conexão solar, conexão livre, conexão Telecom, conexão expansão.
... [Mantenha o resto do seu texto aqui dentro] ...`;

const SYSTEM_PROMPT = `
Você é a Assistente IA da iGreen Energy. Sua missão é ajudar clientes (principalmente idosos) com informações claras e gentis.
Use APENAS o BANCO DE DADOS fornecido. Se não souber a resposta, peça para contatarem o suporte humano no WhatsApp: 5584920039738.
Regra de ouro: Não invente benefícios, prazos ou valores.
`;

window.onload = () => {
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");

    if(sendBtn) sendBtn.addEventListener("click", sendMessage);
    if(userInput) {
        userInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendMessage();
        });
    }
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
                    parts: [{ text: `${SYSTEM_PROMPT}\n\nBANCO DE DADOS:\n${BANCO_DE_DADOS_TEXTO}\n\nPergunta do Cliente: ${userText}` }]
                }],
                generationConfig: {
                    maxOutputTokens: 2048,
                    temperature: 0.3,
                    topP: 0.9
                }
            })
        });

        const data = await response.json();
        
        // Verificação de segurança (Caso o Google bloqueie a resposta)
        if (data.candidates && data.candidates[0].finishReason === "SAFETY") {
            updateBotMessage(typingId, "Desculpe, não posso responder a isso por políticas de segurança. Por favor, entre em contato com nosso suporte humano.");
            return;
        }

        if (data.candidates && data.candidates[0].content) {
            const botResponse = data.candidates[0].content.parts[0].text;
            updateBotMessage(typingId, botResponse);
        } else {
            throw new Error("Resposta inválida");
        }

    } catch (error) {
        console.error("Erro:", error);
        updateBotMessage(typingId, "Desculpe, tive um erro técnico. Pode tentar novamente?");
    }
}

// Função auxiliar para atualizar a mensagem de "Analisando..." para a resposta real
function updateBotMessage(id, newText) {
    const msgElement = document.getElementById(id);
    if (msgElement) {
        const bubble = msgElement.querySelector(".bubble");
        if (bubble) bubble.innerText = newText;
        msgElement.id = ""; // Remove o ID de busca
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
    
    // Scroll suave para a última mensagem
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
}
Conexão solar: O conexão solar, é um modelo alternativo para adquirir um sistema solar fotovoltaico sem investimentos. Com ele, a igreen Energy aluga o telhado do cliente, e o pagamento do aluguel será o próprio sistema solar. Primeiramente, o cliente precisa ser o titular e possuir consumo de 300kwh no mínimo. Depois, a equipe da igreen vai na casa do cliente fazer uma vistoria, para depois fazer a instalação da mini usina de geração distribuída. O contrato firmado entre o cliente e a igreen prevê um período específico para o aluguel a partir de 6 anos. Durante esse período, o sistema solar fotovoltaico no telhado do cliente vai gerar energia para a igreen, e o cliente vai ficar usando essa energia e pagando por ela, cadastrado na energia solar por assinatura, recebendo desconto, participando do clube, e livre das bandeiras. Quando o período acabar, o cliente será proprietário integral do sistema solar fotovoltaico, e poderá usufruir livremente, estando livre da energia por assinatura e sem dever mais nada a igreen, como se tivesse comprado o sistema.

Conexão placas: o conexão placas é o produto mais genérico do mercado de energia solar: a compra das placas. O pagamento pode ser feito por cartão de crédito, financiamento pelo banco do cliente, financiamento pelos bancos parceiros da igreen, ou pagamento a vista. Para que seja feita a contratação é necessário que o consumo seja igual ou superior a 250kwh, mas caso o consumo do cliente seja inferior e mesmo assim ele deseje contratar, é possível fazer a contratação, desde que o sistema seja dimensionado para produzir a partir de 250kwh.

Conexão livre: o produto conexão livre é basicamente a mesma coisa do conexão Green, mas com benefícios exclusivos para empresas de grande porte.

Conexão Telecom: o produto conexão Telecom é referente a operadora iGreen Telecom. A operadora igreen Telecom é uma operadora digital em nuvem, que opera sem torres próprias, conectando-se a torres de outras operadoras próximas para garantir o melhor sinal. A conexão é quase sem fronteiras, a internet é altamente veloz, podendo alcançar conexão 5g. Possui diversos planos que incluem benefícios diversos, como a internet que acumula e whatsapp ilimitado. O uso da operadora também concede benefícios como igreen club com clube certo, programa de indicações, roleta de prêmios e outros benefícios da conexão Green não relacionados a energia. A operadora oferece duas modalidades de contração: nova linha, ou portabilidade. Apesar de a operadora ser brasileira, já está disponível para Estados Unidos e Canadá.

Conexão expansão: o conexão expansão é uma oportunidade de trabalho por meio de franquia, onde o comprador da franquia se torna um licenciado da igreen Energy, autorizado na área de publicidade dos produtos. Cada cadastro na conexão Telecom, livre ou Green pelo link do licenciado, gera uma renda passiva com valores recorrentes, além das comissões nas conexões solar e placas. Quando um licenciado compra a franquia pelo link de outro licenciado, formam uma equipe, onde o licenciado que vendeu a franquia recebe um percentual específico sobre cada cadastro que o novo licenciado fizer. Além disso, a igreen Energy também cria eventos mensais com bônus extra, comissões mais altas, prêmios como motocicletas e carros elétricos, viagens e prêmios em dinheiro. A igreen também fornece treinamentos para conexão solar e placas toda quarta-feira ao vivo no YouTube, mas as aulas ficam gravadas. Além disso, existe uma plataforma chamada igreen academy, por onde o licenciado deve estudar todos os módulos e ser aprovado nos testes antes de vender o produto daquele módulo.
`;

const SYSTEM_PROMPT = `
Você é a Assistente IA da iGreen Energy.
Sua missão é ajudar os clientes (principalmente idosos) com informações claras, gentis e simples.
Use APENAS as informações contidas no "BANCO DE DADOS" abaixo para responder. 
Se a informação não estiver lá, diga educadamente que não possui essa informação e oriente a procurar o suporte humano.

BANCO DE DADOS:
${BANCO_DE_DADOS_TEXTO}
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
                    parts: [{ text: `${SYSTEM_PROMPT}\n\nPergunta do Cliente: ${userText}` }]
                }],
                generationConfig: {
                    maxOutputTokens: 2048, // Ajustado para 2048 conforme solicitado
                    temperature: 0.3,      // Mantém a IA focada nos fatos
                    topP: 0.9,
                    topK: 40
                }
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content) {
            const botResponse = data.candidates[0].content.parts[0].text;
            document.getElementById(typingId).remove();
            addMessageToChat(botResponse, "bot");
        } else {
            throw new Error("Resposta inválida da API");
        }

    } catch (error) {
        console.error("Erro na requisição:", error);
        document.getElementById(typingId).innerHTML = "<div class='bubble'>Desculpe, tive um erro técnico. Pode tentar novamente em instantes?</div>";
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
