# 🏎️ Prime Motors — Plataforma Automotiva Premium

> Ecossistema completo (Web, Mobile e API REST) para consulta de veículos de luxo, gerenciamento de propostas, agendamento de test drives e moderação administrativa.

---

## 📌 Sobre o Projeto

O **Prime Motors** é uma plataforma centralizada projetada para conectar compradores de veículos premium a um catálogo completo e interativo. O ecossistema elimina a dispersão de informações e otimiza a jornada do cliente, desde a busca técnica até o fechamento da proposta e agendamento de test drives.

### 🌟 Diferenciais
- **Paridade de Recursos**: Todas as funcionalidades do portal web estão integradas ao aplicativo mobile.
- **Gerenciamento Admin Mobile (`AdminPropostas`)**: Módulo exclusivo no aplicativo mobile que permite aos administradores gerenciar e alterar o status de propostas em tempo real.
- **Controle de Acesso Baseado em Funções (RBAC)**: Distinção clara de permissões entre usuários clientes (`User`) e administradores (`Admin`).

---

## 🛠️ Tecnologias Utilizadas

### **Backend (API REST)**
- **Node.js** & **Express** (com TypeScript)
- **Prisma ORM**
- **MySQL** (Banco de dados relacional)
- **JWT (JSON Web Token)** para autenticação e autorização
- **Middleware RBAC** (Role-Based Access Control)

### **Frontend Web**
- **React / TypeScript**
- **Tailwind CSS / CSS Modules**
- Consumo assíncrono da API REST

### **Mobile App**
- **React Native** & **Expo**
- **Expo Router** (Navegação baseada em arquivos)
- **NativeWind / Tailwind CSS**
- Módulos organizados: `(auth)`, `explorar`, `detalhes`, `Favoritos`, `Garagem`, `Perfil`, `TestDrive` e `AdminPropostas`.

---

## 🚀 Estrutura de Funcionalidades e CRUDs

| Funcionalidade | Papel (`User`) | Administrador (`Admin`) | Web | Mobile |
| :--- | :---: | :---: | :---: | :---: |
| **Autenticação & Registro** | ✅ | ✅ | ✅ | ✅ |
| **Catálogo de Veículos & Filtros** | ✅ | ✅ | ✅ | ✅ |
| **Detalhes do Veículo & ESPEC** | ✅ | ✅ | ✅ | ✅ |
| **Gerenciamento de Favoritos** | ✅ | ✅ | ✅ | ✅ |
| **Garagem Virtual** | ✅ | ✅ | ✅ | ✅ |
| **Agendamento de Test Drive** | ✅ | ✅ | ✅ | ✅ |
| **Envio e Gestão de Propostas** | ✅ | ✅ | ✅ | ✅ |
| **Gerenciamento Admin de Propostas** | ❌ | ✅ | ✅ | ✅ (`AdminPropostas`) |

---

## 📁 Estrutura do Repositório Mobile

```text
PrimeMotors-Mobile/
├── Mobile/
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── AdminPropostas/   # Módulo exclusivo de gestão Admin no mobile
│   │   │   ├── detalhes/         # Detalhes do veículo e especificações
│   │   │   ├── explorar/         # Busca e filtros
│   │   │   ├── Favoritos/        # Veículos salvos
│   │   │   ├── Garagem/          # Garagem virtual do usuário
│   │   │   ├── Perfil/           # Dados e preferências
│   │   │   └── TestDrive/        # Agendamentos de test drive
│   │   └── (auth)/               # Telas de Login e Cadastro
│   └── src/                      # Componentes, contextos, serviços e utilitários

```

## 👥 Integrantes / Autores

| Desenvolvedor | Perfil / Repositório GitHub |
| :--- | :--- |
| 👤 **Aitom Henrique Donatoni** | [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/seu-usuario-aitom) |
| 👤 **Fernando Consolin Rosa** | [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/FernandoConsolinRosa11) |
