
## 📌 Sobre o projeto Prime Motors

Este projeto tem como objetivo simular uma aplicação real, focando na construção de uma API para gerenciamento de dados, utilizando operações completas de CRUD (Create, Read, Update e Delete).

## 🛠️ Tecnologias utilizadas

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 🔐 Segurança

* Validação de dados utilizando regex
* Tratamento de entradas do usuário
* Armazenamento seguro de dados sensíveis (como senhas) com criptografia

## 🔄 Funcionalidades

* Cadastro de usuários
* Listagem de dados
* Edição de registros
* Exclusão de dados
* API REST para comunicação com o front-end

## 🔗 Integração

O back-end se comunica com um projeto front-end desenvolvido em React, através de requisições HTTP (API REST).

## 🗄️ Banco de dados

O projeto utiliza Prisma ORM para gerenciamento do banco de dados.

## 🔗 Projeto completo 
💻 Front-end: (https://github.com/FernandoConsolinRosa11/FrontEnd2026) 

⚙️ Back-end: (https://github.com/AitomD/PrimeMotors-backend)

## 👨‍💻 Desenvolvedores

- [Aitom Donatoni](https://github.com/AitomD)  
- [Fernando Consolin](https://github.com/FernandoConsolinRosa11)

---

## 🚀 Uso do backend

### Pré-requisitos

- Node.js 18+ instalado
- Docker e Docker Compose instalados
- Um banco MySQL disponível ou o serviço via Docker Compose dentro de `PrimeMotors-docker`

### Instalação

1. Copie o template de variáveis:
   ```bash
   cd PrimeMotors-backend
   cp .env.example .env
   npm install
   ```
2. Atualize o arquivo `.env` com as credenciais reais do banco.

### Executando localmente

```bash
npm run dev
```

### Rodando o build

```bash
npm run build
npm start
```

### Testes

```bash
npm test
```

### Husky

O backend agora usa Husky para prevenir commits/pushes sem testes.

- `npm install` instala o hook de Husky automaticamente via `prepare`
- `git commit` dispara o hook `pre-commit`
- `git push` dispara o hook `pre-push`

### Hooks configurados

- `.husky/pre-commit` → `npm test`
- `.husky/pre-push` → `npm test`

### Observações de segurança

- Não versionar arquivos `.env`
- Use `.env.example` para compartilhar variáveis de ambiente
- Rotacione segredos antes de subir para repositório
