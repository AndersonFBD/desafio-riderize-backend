# desafio-riderize-backend

teste prático da Riderize para a função de desenvolvedor backend

## Objetivo

O objetivo foi produzir uma API GraphQL que possa:

- Cadastrar usuários
- Efetuar login
- Cadastrar pedais
- Consultar pedais disponíveis para inscrição
- Inscrever usuários em pedais
- Consultar pedais criados e/ou inscritos por um usuário

## Tecnologias usadas

- **Node.js**
- **Typescript**
- **GraphQL**
- **Apollo Server**
- **Prisma ORM**
- **PostgresSQL**
- **JWT**

## Autenticação

Ao realizar o login, adicione o token retornado no header Authorization da requisição GraphQL

Authorization: seu_token

## Instruções

### 1. Clone este repositório

```bash
  git clone  https://github.com/AndersonFBD/desafio-riderize-backend.git
```

### 2. Instale as dependencias

```bash
    npm install
```

### 3. Configure o ambiente

Há um arquivo .env.exemplo que pode ser usado para criar o seu .env

### 4. Rode a migration do prisma

```bash
    npx prisma migrate dev --name init
```

### 5. Inicie o servidor

```bash
    npm run dev
```

O playground do apollo server estará disponível em localhost:4000
