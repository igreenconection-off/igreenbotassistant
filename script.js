document.addEventListener('DOMContentLoaded', () => {

    // --- REFERÊNCIAS AOS ELEMENTOS DO HTML ---
    const chatMessages = document.getElementById('chat-messages');
    const chatOptions = document.getElementById('chat-options');

    // --- CONSTANTES DE LINKS E ÍCONES ---
    const BOT_ICON_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL7d1tVe34hH7WxuBvKRlXDF-GetD5U5eWxg&s';
    
    // Links de "Desconto na Fatura"
    const LINK_CADASTRO_DESCONTO = 'https://igreenconection-off.github.io/IGREENCONECTION/';
    const WA_DUVIDAS_CADASTRO = 'https://wa.me/5584920039738?text=Ol%C3%A1!%20J%C3%A1%20fiz%20o%20cadastro%20do%20desconto%20na%20fatura%20e%20desejo%20tirar%20d%C3%BAvidas.';
    const WA_AJUDA_CADASTRO = 'https://wa.me/5584920039738?text=Ol%C3%A1!%20Desejo%20me%20cadastrar%20para%20obter%20o%20desconto%20na%20fatura%20de%20energia.%20Tentei%20s%C3%B3%20e%20n%C3%A3o%20consegui.';

    // Links de "iGreen Telecom"
    const WA_NOVO_CHIP = 'https://wa.me/5584920039738?text=Ol%C3%A1!%20Desejo%20contratar%20um%20novo%20chip%20iGreen%20Telecom,%20pode%20me%20ajudar?';
    const WA_PORTABILIDADE = 'https://wa.me/5584920039738?text=Ol%C3%A1!%20Desejo%20solicitar%20a%20portabilidade%20do%20meu%20n%C3%BAmero%20para%20a%20iGreen%20Telecom.%20Pode%20me%20ajudar?';
    const WA_SUPORTE_TELECOM = 'https://wa.me/558001830080?text=Ol%C3%A1!%20J%C3%A1%20sou%20cliente%20iGreen%20Telecom%20e%20desejo%20suporte.';

    // Links de Placas Solares e Aluguel
    const LINK_BOT_PLACAS_SOLARES = 'https://igreenconection-off.github.io/conex-oplacasesolar/';

    // Link "Ser Divulgador" (adicionado ?embedded=true para melhor visualização)
    const FORM_DIVULGADOR = 'https://docs.google.com/forms/d/e/1FAIpQLScRb0k71iMQxP56I54euwRW8tnxcJVqBujT0du4wtFgCHUC4g/viewform?embedded=true';

    // Link "Trabalhe Conosco"
    const WA_TRABALHE_CONOSCO = 'https://wa.me/5584920039738?text=Ol%C3%A1!%20Desejo%20me%20tornar%20um%20franquiado%20e%20trabalhar%20com%20a%20iGreen%20Energy%20na%20minha%20cidade.%20Pode%20me%20explicar%20mais%20sobre%20os%20produtos%20que%20a%20empresa%20oferta,%20e%20como%20funciona%20o%20processo%20de%20compra%20da%20franquia?';
    
    // Botão reutilizável
    const MENU_PRINCIPAL_BTN = { text: 'Menu Principal', action: startChat };

    // --- FUNÇÕES AUXILIARES ---

    /** Rola o chat para a última mensagem */
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /** Limpa todos os botões de opção */
    function clearOptions() {
        chatOptions.innerHTML = '';
    }

    /** Adiciona uma mensagem do BOT ao chat */
    function addBotMessage(message, delay = 500) {
        return new Promise(resolve => {
            setTimeout(() => {
                const msgContainer = document.createElement('div');
                msgContainer.className = 'bot-message-container';

                msgContainer.innerHTML = `
                    <img src="${BOT_ICON_URL}" alt="Bot" class="bot-icon">
                    <div class="message bot-message">${message}</div>
                `;
                chatMessages.appendChild(msgContainer);
                scrollToBottom();
                resolve();
            }, delay);
        });
    }

    /** Adiciona uma mensagem do USUÁRIO ao chat */
    function addUserMessage(message) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user-message';
        msgDiv.textContent = message;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    /** Adiciona os botões de opção */
    function addOptions(options) {
        clearOptions();
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option.text;
            button.onclick = option.action;
            chatOptions.appendChild(button);
        });
    }

    /** Adiciona um formulário iframe ao chat */
    function addForm(url) {
        const formContainer = document.createElement('div');
        formContainer.className = 'form-container';
        formContainer.innerHTML = `<iframe id="google-form" src="${url}">Carregando formulário...</iframe>`;
        chatMessages.appendChild(formContainer);
        scrollToBottom();
    }

    // --- FUNÇÕES DE FLUXO DO CHAT ---

    /** Inicia ou reinicia o chat */
    function startChat() {
        chatMessages.innerHTML = '';
        clearOptions();
        addBotMessage("Olá, seja bem-vindo(a) à iGreen Energy. Sobre o que vamos conversar hoje?", 200).then(() => {
            addOptions([
                { text: 'Desconto na fatura de energia', action: handleDescontoFatura },
                { text: 'iGreen Telecom', action: handleTelecom },
                { text: 'Compra de placas solares', action: handlePlacasSolares },
                { text: 'Aluguel de telhado', action: handleAluguelTelhado },
                { text: 'Ser divulgador', action: handleSerDivulgador },
                { text: 'Trabalhe conosco', action: handleTrabalheConosco }
            ]);
        });
    }

    // --- Ramo 1: Desconto na Fatura ---
    function handleDescontoFatura() {
        addUserMessage('Desconto na fatura de energia');
        clearOptions();
        addBotMessage('Desconto na fatura de energia, entendido! O que exatamente você quer falar sobre o assunto?').then(() => {
            addOptions([
                { text: 'Receber desconto agora', action: handleDesconto_Receber },
                { text: 'Já fiz o cadastro, preciso tirar dúvidas', action: handleDesconto_Duvidas },
                { text: 'Não consegui fazer o cadastro sozinho(a)', action: handleDesconto_Ajuda }
            ]);
        });
    }

    function handleDesconto_Receber() {
        addUserMessage('Receber desconto agora');
        clearOptions();
        addBotMessage('Ótimo! Clique em "Cadastrar Agora" para fazer o seu cadastro e receber o desconto.').then(() => {
            addOptions([
                { text: 'Cadastrar Agora', action: () => window.location.href = LINK_CADASTRO_DESCONTO },
                MENU_PRINCIPAL_BTN
            ]);
        });
    }

    function handleDesconto_Duvidas() {
        addUserMessage('Já fiz o cadastro, preciso tirar dúvidas');
        clearOptions();
        addBotMessage('Que legal! Nossa equipe de suporte terá prazer em te atender. Clique em "Contatar Suporte no WhatsApp".').then(() => {
            addOptions([
                { text: 'Contatar Suporte no WhatsApp', action: () => window.location.href = WA_DUVIDAS_CADASTRO },
                MENU_PRINCIPAL_BTN
            ]);
        });
    }

    function handleDesconto_Ajuda() {
        addUserMessage('Não consegui fazer o cadastro sozinho(a)');
        clearOptions();
        addBotMessage('Calma! Vai dar tudo certo. Nossa equipe de suporte no WhatsApp está disponível para te auxiliar agora com isso. Clique em "Contatar Suporte no WhatsApp" para prosseguir.').then(() => {
            addOptions([
                { text: 'Contatar Suporte no WhatsApp', action: () => window.location.href = WA_AJUDA_CADASTRO },
                MENU_PRINCIPAL_BTN
            ]);
        });
    }

    // --- Ramo 2: iGreen Telecom ---
    function handleTelecom() {
        addUserMessage('iGreen Telecom');
        clearOptions();
        addBotMessage('iGreen Telecom, que legal! Sobre o que exatamente você deseja falar?').then(() => {
            addOptions([
                { text: 'Contratar um novo chip iGreen', action: handleTelecom_NovoChip },
                { text: 'Fazer portabilidade para iGreen', action: handleTelecom_Portabilidade },
                { text: 'Já sou cliente, preciso de suporte', action: handleTelecom_Suporte }
            ]);
        });
    }

    function handleTelecom_NovoChip() {
        addUserMessage('Contratar um novo chip iGreen');
        clearOptions();
        addBotMessage('Que legal! Para fazer a contratação do seu chip iGreen, entre em contato com a nossa central especializada de suporte ao consumidor, eles vão te auxiliar em tudo! Clique em "Contatar Suporte no WhatsApp".').then(() => {
            addOptions([
                { text: 'Contatar Suporte no WhatsApp', action: () => window.location.href = WA_NOVO_CHIP },
                MENU_PRINCIPAL_BTN
            ]);
        });
    }

    function handleTelecom_Portabilidade() {
        addUserMessage('Fazer portabilidade para iGreen');
        clearOptions();
        addBotMessage('Que legal! Para solicitar a portabilidade do seu chip para a iGreen, entre em contato com a nossa central especializada de suporte ao consumidor, eles vão te auxiliar em tudo! Clique em "Contatar Suporte no WhatsApp".').then(() => {
            addOptions([
                { text: 'Contatar Suporte no WhatsApp', action: () => window.location.href = WA_PORTABILIDADE },
                MENU_PRINCIPAL_BTN
            ]);
        });
    }

    function handleTelecom_Suporte() {
        addUserMessage('Já sou cliente, preciso de suporte');
        clearOptions();
        addBotMessage('Que legal! Temos uma central exclusiva para solução de problemas para os clientes. Clique em "Contatar Suporte no WhatsApp".').then(() => {
            addOptions([
                { text: 'Contatar Suporte no WhatsApp', action: () => window.location.href = WA_SUPORTE_TELECOM },
                MENU_PRINCIPAL_BTN
            ]);
        });
    }

    // --- Ramo 3 e 4: Placas e Aluguel (Redirecionamento) ---
    function handlePlacasSolares() {
        addUserMessage('Compra de placas solares');
        clearOptions();
        addBotMessage('Parabéns pela decisão de aderir a energia verde e contribuir para um mundo melhor e mais sustentável! Para prosseguir com a contratação, verifique as informações a seguir clicando em "Conferir Requisitos de Contratação".').then(() => {
            addOptions([
                { text: 'Conferir Requisitos de Contratação', action: handleSolarRedirect }
            ]);
        });
    }

    function handleAluguelTelhado() {
        addUserMessage('Aluguel de telhado');
        clearOptions();
        addBotMessage('Parabéns pela decisão de aderir a energia verde e contribuir para um mundo melhor e mais sustentável! Para prosseguir com a contratação, verifique as informações a seguir clicando em "Conferir Requisitos de Contratação".').then(() => {
            addOptions([
                { text: 'Conferir Requisitos de Contratação', action: handleSolarRedirect }
            ]);
        });
    }

    // Ação de redirecionamento para Placas e Aluguel
    function handleSolarRedirect() {
        addUserMessage('Conferir Requisitos de Contratação');
        clearOptions();
        addBotMessage('Estou te redirecionando para o time especializado...').then(() => {
            // Adiciona um pequeno delay para o usuário ler a mensagem
            setTimeout(() => {
                // Redireciona para o link do bot de placas/aluguel
                window.location.href = LINK_BOT_PLACAS_SOLARES;
            }, 1500); // 1.5 segundos de espera
        });
    }


    // --- Ramo 5: Ser Divulgador ---
    function handleSerDivulgador() {
        addUserMessage('Ser divulgador');
        clearOptions();
        addBotMessage(
            "Muito bom! Fico feliz que deseje fazer parte da família iGreen Energy! Como divulgador, sua tarefa será captar clientes que desejam contratar nossos serviços, encaminhá-los à nossa central e receber comissões por cada cliente aprovado. Não se trata de uma vaga de emprego, mas de um trabalho de renda extra que pode ser feito a qualquer hora, e qualquer lugar e com pagamento 100% comissionado. Você não precisará investir nada!" +
            "<br><br>Caso deseje se cadastrar como divulgador, preencha o formulário de cadastro a seguir."
        ).then(() => {
            addForm(FORM_DIVULGADOR);
            addOptions([
                { text: 'Reiniciar Atendimento', action: startChat }
            ]);
        });
    }

    // --- Ramo 6: Trabalhe Conosco ---
    function handleTrabalheConosco() {
        addUserMessage('Trabalhe conosco');
        clearOptions();
        addBotMessage('Que legal, você deseja fazer parte da família iGreen Energy! Atualmente nós trabalhamos com regime de franquia. Uma franquia, é uma filial da empresa que você pode comprar e administrar de forma independente. Você se torna parte de nós e nós vamos te fornecer os treinamentos necessários para trabalhar conosco. Você pode construir sua renda passiva conosco e receber uma "aposentadoria" para sempre! Quer saber como? Contate a nossa equipe de suporte clicando em "Contatar Suporte no WhatsApp".').then(() => {
            addOptions([
                { text: 'Contatar Suporte no WhatsApp', action: () => window.location.href = WA_TRABALHE_CONOSCO },
                MENU_PRINCIPAL_BTN
            ]);
        });
    }

    // --- INICIA O CHAT QUANDO A PÁGINA CARREGA ---
    startChat();

});
