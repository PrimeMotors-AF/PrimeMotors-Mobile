# Arquitetura do sistema — C4

## Escopo e estado atual

Esta documentação foi preparada a partir da estrutura do repositório, dos
serviços Compose, das rotas/controllers Express e do schema Prisma. Ela não
afirma comportamentos além dos observados.

O repositório contém:

- `Mobile`: cliente Expo/React Native, também exportado para web.
- `PrimeMotors-backend`: API TypeScript/Express, Prisma e testes Jest.
- `PrimeMotors-docker`: composição de MySQL, Redis, API e frontend web.
- `PrimeMotors-Email-Service`: API FastAPI para emails de proposta, consumer
  Redis Stream e MySQL próprio. O Compose principal integra backend, Redis,
  consumer/API e banco do serviço; o Compose isolado inicia somente o MySQL do
  serviço. Consulte também [email-service.md](../email-service.md).

O backend contém módulos de autenticação, usuários, catálogo de veículos,
favoritos, propostas e test drives, mas compartilha processo e banco. A
descrição adequada é **monólito modular**, não microserviços independentes. O
Outbox/Redis integra a publicação de eventos de propostas.

## C1 — Contexto

```mermaid
flowchart LR
  visitante[Visitante / comprador]
  administrador[Administrador]
  plataforma[Prime Motors<br/>plataforma de compra e gestão de veículos]
  email[Serviço de notificações<br/>FastAPI]
  cloudinary[Cloudinary<br/>serviço externo de imagens]
  smtp[Provedor SMTP]

  visitante -->|navega, cadastra-se, favorita,<br/>faz propostas e agenda test drives| plataforma
  administrador -->|administra usuários e analisa propostas| plataforma
  plataforma -->|solicita notificação de proposta| email
  email -->|consulta detalhes da proposta<br/>por endpoint interno autenticado| plataforma
  plataforma -->|armazena imagens de perfil| cloudinary
  email -->|envia confirmação e aviso de proposta| smtp
```

## C2 — Containers

```mermaid
flowchart LR
  visitante[Visitante / comprador]
  administrador[Administrador]
  dispositivo[App Expo nativo<br/>Android / iOS]
  cloudinary[Cloudinary<br/>armazenamento de imagens]
  smtp[Provedor SMTP]

  subgraph compose["Implantação principal — PrimeMotors-docker"]
    mobile[Nginx + aplicação web<br/>export web do Expo em Mobile]
    api[API monólito modular<br/>Node.js + Express + Prisma]
    mysql[(MySQL 8<br/>dados transacionais)]
    redis[(Redis 7<br/>cache, rate limit, Pub/Sub e Stream)]
    email[Serviço de e-mail<br/>FastAPI + consumer Redis Stream]
    emailMysql[(MySQL do serviço<br/>dados de e-mail e rate limit)]
  end

  subgraph foraCompose["Aplicação do repositório não incluída no Compose principal"]
    frontend[Frontend React + Vite<br/>PrimeMotors-FrontEnd]
  end

  visitante -->|"HTTP(S)"| mobile
  administrador -->|"HTTP(S)"| mobile
  visitante -.->|se disponível em deploy separado| frontend
  administrador -.->|se disponível em deploy separado| frontend
  mobile -->|arquivos web; proxy das rotas da API| api
  dispositivo -->|HTTP/JSON; URL da API configurada| api
  frontend -.->|HTTP/JSON; integração e deploy separados| api
  api -->|SQL via Prisma| mysql
  api -->|cache, rate limit, Pub/Sub e publicação no Stream| redis
  redis -->|eventos de proposta com IDs| email
  email -->|busca dados pelo endpoint interno autenticado| api
  email -->|SQL via SQLAlchemy| emailMysql
  api -->|upload de imagens de perfil| cloudinary
  email -->|envio de e-mails| smtp
```

O container `mobile` do Compose é construído a partir de `Mobile`: serve o
export web do Expo com Nginx e encaminha rotas da API ao backend. Nginx e
aplicação web não são containers separados. O app Expo nativo pode ser
executado em dispositivos, mas não é iniciado pelo Compose. O consumer Redis
Stream é uma tarefa em background no processo do serviço FastAPI, não um
container independente. `PrimeMotors-FrontEnd` (React/Vite) é outra aplicação
do repositório e não integra a composição principal.

Na composição principal, a API aguarda MySQL e Redis saudáveis; `mobile` aguarda
a prontidão da API; o serviço de e-mail depende do seu MySQL, Redis e backend.
`GET /health/ready` verifica MySQL e Redis. O Compose descreve uma implantação
em containers, não uma topologia de alta disponibilidade: não define réplicas,
balanceador ou failover de banco.
