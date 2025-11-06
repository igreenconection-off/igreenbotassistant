/* Configurações Globais */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

body {
    background-color: #f3f3f3; /* Cor de fundo off-white */
    color: #fff;
}

/* Cabeçalho */
header {
    background-color: #70BB50; /* Faixa verde */
    padding: 20px 10px;
    text-align: center;
    width: 100%;
}

header img {
    max-width: 250px; /* Tamanho do logo */
    height: auto;
}

/* Container Principal do Chat */
main {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 15px;
}

#chat-container {
    width: 100%;
    max-width: 700px;
    background-color: #192315; /* Verde acinzentado */
    border: 2px solid #70BB50; /* Contorno verde */
    border-radius: 15px; /* Cantos arredondados */
    overflow: hidden; /* Garante que os filhos respeitem os cantos */
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Área de Mensagens */
#chat-messages {
    height: 450px;
    overflow-y: auto; /* Permite rolar as mensagens */
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* Estilo das Mensagens */
.message {
    padding: 12px 18px;
    border-radius: 18px;
    max-width: 85%;
    line-height: 1.5;
}

/* Mensagem do Bot */
.bot-message-container {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    align-self: flex-start;
}

.bot-icon {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: cover;
    margin-top: 5px;
}

.bot-message {
    background-color: #3a3a3a; /* Fundo do balão do bot */
    border-top-left-radius: 0;
}

/* Mensagem do Usuário */
.user-message {
    background-color: #70BB50; /* Fundo do balão do usuário */
    color: #192315; /* Texto escuro no balão verde */
    align-self: flex-end; /* Alinha à direita */
    border-top-right-radius: 0;
    font-weight: bold;
}

/* Container do Formulário */
.form-container {
    width: 100%;
    padding: 10px 0;
}

#google-form {
    width: 100%;
    height: 400px; /* Altura do formulário */
    border: none;
    border-radius: 8px;
}

/* Mensagem de Fim de Chat */
.end-message {
    text-align: center;
    font-style: italic;
    color: #aaa;
    padding: 10px;
    font-size: 0.9em;
}

/* Área de Opções (Botões) */
#chat-options {
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    border-top: 1px solid #333; /* Linha divisória */
}

.option-button {
    background-color: #70BB50;
    color: #192315;
    border: none;
    padding: 12px 25px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1em;
    transition: background-color 0.3s;
}

.option-button:hover {
    background-color: #8ade6a; /* Efeito hover */
}
