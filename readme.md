# Simple Chat

Este é um protótipo de um chat simples utilizando Node.js, Express e Socket.IO.

## Estrutura do Projeto
chatbot/
├── index.js 
├── package.json 
├── public/ 
│   └── index.html 
└── readme.md

## Pré-requisitos

- Node.js
- npm (Node Package Manager)

## Instalação

1. Clone o repositório:

    ```sh
    git clone https://github.com/seu-usuario/chatbot.git
    cd chatbot
    ```

2. Instale as dependências:

    ```sh
    npm install
    ```

## Uso

1. Inicie o servidor:

    ```sh
    node index.js
    ```

2. Abra seu navegador e acesse [http://localhost:3000](http://localhost:3000).

## Funcionalidades

- **Conexão de Usuários**: O servidor registra quando um usuário se conecta e desconecta.
- **Mensagens de Chat**: Os usuários podem enviar mensagens de chat que são transmitidas para todos os usuários conectados.
- **Preferência de Exibição de Nome**: O primeiro usuário a se conectar pode decidir se os nomes dos usuários serão exibidos nas mensagens.

## Estrutura do Código

- **index.js**: Configura o servidor Express e Socket.IO, gerencia conexões de usuários e mensagens de chat.
- **public/index.html**: Interface do usuário para o chat.

## Dependências

- [Express](https://expressjs.com/): Framework web para Node.js.
- [Socket.IO](https://socket.io/): Biblioteca para comunicação em tempo real.

## Autor

Javan

## Licença

ISC