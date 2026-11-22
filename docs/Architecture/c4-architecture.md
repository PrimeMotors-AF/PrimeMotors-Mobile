# Arquitetura do sistema — C4

## Escopo

O sistema Prime Motors contém:

- `Mobile`: cliente Expo/React Native, também exportado para web.
- `PrimeMotors-backend`: API TypeScript/Express, Prisma e testes Jest.
- `PrimeMotors-docker`: composição de MySQL, Redis, API e frontend web.
- `PrimeMotors-Email-Service`: API FastAPI para emails de proposta, consumer
  Redis Stream e MySQL próprio. O Compose principal integra backend, Redis,
  consumer/API e banco do serviço; o Compose isolado inicia somente o MySQL do
  serviço. O fluxo de notificações está detalhado em
  [email-service.md](../Services/email-service/email-service.md).

O backend contém módulos de autenticação, usuários, catálogo de veículos,
favoritos, propostas e test drives, mas compartilha processo e banco. A
arquitetura é um **monólito modular**. O serviço de e-mail é um processo
separado. A Outbox e o Redis Stream transportam os eventos de propostas.

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
  api -->|cache, rate limit, Pub/Sub e Stream; breaker no publisher do Stream| redis
  redis -->|Redis Stream: eventos de proposta com IDs| email
  api -.->|Redis Pub/Sub: notificação complementar| redis
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

O publisher da Outbox protege a gravação no Redis Stream com um circuit breaker
por processo: abre após cinco falhas consecutivas, aguarda 30 segundos e permite
uma tentativa de sondagem em estado half-open. A Outbox mantém seu retry
exponencial e retém os eventos até a publicação ser confirmada. O Redis Pub/Sub
é complementar; seu subscriber registra a circulação do evento, enquanto o
consumer do serviço de e-mail processa o Redis Stream.

A API registra requisições em JSON com identificador de correlação, rota,
status e duração. Erros HTTP usam um envelope comum com mensagem, código e
request ID; detalhes internos são enviados aos logs, não à resposta 500.

## C3 — Componentes

Os diagramas abaixo detalham os componentes implementados em cada aplicação.
As setas tracejadas indicam integrações opcionais ou executadas fora do
Compose principal.

### Mobile — Expo / React Native

```mermaid
flowchart LR
  visitante[Visitante / comprador]
  administrador[Administrador]
  backend[API PrimeMotors]

  subgraph mobile["Mobile — aplicação Expo"]
    telas["Telas Expo Router<br/>Explorar, detalhes, garagem,<br/>favoritos, perfil e test drive"]
    admin["Tela administrativa<br/>AdminPropostas"]
    componentes["Componentes compartilhados<br/>cards, modais e navegação"]
    auth["Contexto de autenticação<br/>e armazenamento local"]
    servicos["Serviços de domínio<br/>carros, usuários, propostas,<br/>favoritos e test drives"]
    api["Cliente Axios<br/>URL configurada e Bearer token"]
  end

  visitante --> telas
  administrador --> admin
  telas --> componentes
  admin --> componentes
  telas --> auth
  admin --> auth
  telas --> servicos
  admin --> servicos
  auth --> api
  servicos --> api
  api -->|HTTP/JSON| backend
```

O cliente Axios centraliza a URL da API e anexa o token de autenticação
armazenado no dispositivo. O mesmo código Expo pode ser exportado para web; no
Compose, o Nginx serve esse export e encaminha as rotas da API.

### Frontend — React / Vite

```mermaid
flowchart LR
  visitante[Visitante / comprador]
  administrador[Administrador]
  backend[API PrimeMotors]

  subgraph frontend["PrimeMotors-FrontEnd — aplicação React"]
    rotas["App e rotas<br/>Home, explorar, produto,<br/>garagem e perfil"]
    paginas["Páginas e componentes<br/>catálogo, propostas,<br/>favoritos e test drive"]
    auth["AuthProvider e contexto<br/>de autenticação"]
    servicos["Serviços de API<br/>auth, usuário, carro,<br/>proposta e test drive"]
    api["Cliente HTTP<br/>e token de autenticação"]
  end

  visitante --> rotas
  administrador --> rotas
  rotas --> paginas
  rotas --> auth
  paginas --> servicos
  auth --> servicos
  servicos --> api
  api -.->|HTTP/JSON; deploy separado| backend
```

Este frontend React/Vite é uma aplicação distinta do Mobile e não faz parte da
composição principal. Sua integração com a API depende de configuração e
deploy separados.

### Backend — API monólita modular

```mermaid
flowchart LR
  clientes["Mobile / Frontend web"]
  mysql[(MySQL)]
  redis[(Redis)]
  cloudinary[Cloudinary]

  subgraph backend["PrimeMotors-backend — Express"]
    app["app.ts<br/>middlewares globais,<br/>rotas e health check"]
    rotas["Rotas<br/>auth, users, cars, garage,<br/>favorites e test-drives"]
    protecao["Middlewares<br/>JWT, papel admin, rate limit,<br/>logs e tratamento de erros"]
    controllers["Controllers<br/>autenticação, usuários, carros,<br/>propostas, favoritos e agenda"]
    validacao["DTOs e erros<br/>validação de entrada,<br/>paginação e ApiError"]
    servicos["Serviços<br/>cache de carros, upload,<br/>Outbox e eventos de proposta"]
    prisma["Prisma Client"]
    config["Configuração<br/>conexão MySQL e Redis"]
  end

  clientes -->|HTTP/JSON| app
  app --> rotas
  rotas --> protecao
  protecao --> controllers
  rotas --> controllers
  controllers --> validacao
  controllers --> prisma
  controllers --> servicos
  servicos --> prisma
  servicos --> config
  prisma --> config
  config --> mysql
  config --> redis
  servicos -->|upload de avatar| cloudinary
```

As rotas, controllers e serviços executam no mesmo processo Node.js. Prisma é
a camada de acesso ao MySQL; Redis é usado por cache, rate limit e fluxo de
eventos. A rota interna de dados de email autentica o serviço por
`X-Service-Token`, enquanto as rotas de usuário usam JWT e as operações
administrativas também verificam o papel do usuário.

### Serviço de e-mail — FastAPI

```mermaid
flowchart LR
  backend[Backend]
  redis[(Redis<br/>Stream e idempotência)]
  mysql[(MySQL do serviço)]
  smtp[Provedor SMTP]

  subgraph email["PrimeMotors-Email-Service"]
    main["Main.py<br/>FastAPI, readiness<br/>e ciclo de vida"]
    http["emailRoutes.py<br/>POST /emails/proposal-created"]
    consumer["emailStreamConsumer.py<br/>grupo, leitura, retry<br/>e dead-letter"]
    lookup["Consulta ao backend<br/>endpoint interno autenticado"]
    controller["emailController.py<br/>persistência, idempotência<br/>e limite de envio"]
    idem["emailIdempotencyService.py"]
    rate["emailRateLimitService.py"]
    envio["emailService.py<br/>montagem e envio SMTP"]
    models["Modelos Pydantic e SQLAlchemy"]
    db["database/connection.py"]
  end

  main --> http
  main --> consumer
  http --> controller
  consumer --> redis
  consumer --> lookup
  lookup -->|HTTP + X-Service-Token| backend
  consumer -->|controller no mesmo processo| controller
  controller --> idem
  controller --> rate
  controller --> envio
  controller --> models
  controller --> db
  idem --> redis
  rate --> db
  envio --> smtp
  db --> mysql
```

O consumer é uma tarefa em background do processo FastAPI, não um container
separado. O endpoint HTTP e o consumer convergem no mesmo controller; o
consumer obtém os dados completos da proposta no backend antes de processar o
evento.

## C4 — Código

Os diagramas C4 abaixo detalham as dependências de código dos fluxos críticos
de propostas e notificações; não representam todas as classes nem substituem a
documentação de cada serviço.

### Backend — criação e publicação da proposta

```mermaid
flowchart LR
  rota["src/routes/userGarageRoutes.ts<br/>POST /garage/proposals"]
  auth["src/middlewares/authMiddleware.ts<br/>valida JWT"]
  controller["src/controllers/garageController.ts<br/>createProposal"]
  dto["src/dtos/proposal.dto.ts<br/>parseCreateProposalDto"]
  prisma["src/config/database.ts<br/>Prisma Client"]
  transacao["Transação Prisma<br/>cria Garage e ProposalOutbox"]
  dispatcher["src/server.ts<br/>inicia dispatcher e subscriber"]
  outbox["src/services/proposalOutbox.ts<br/>varre, reserva e tenta publicar"]
  events["src/services/proposalEvents.ts<br/>serializa evento"]
  breaker["src/services/circuitBreaker.ts<br/>protege publicação no Stream"]
  stream[(Redis Stream<br/>email.confirmations)]
  pubsub[(Redis Pub/Sub<br/>proposals.created)]

  rota --> auth
  auth --> controller
  controller --> dto
  controller --> transacao
  transacao --> prisma
  dispatcher --> outbox
  dispatcher --> events
  outbox --> prisma
  outbox --> events
  events --> breaker
  breaker --> stream
  events -.->|notificação complementar| pubsub
```

A proposta e o registro da Outbox são gravados atomicamente. O dispatcher
publica os identificadores no Stream e marca o registro como publicado após
confirmação; em falhas, agenda nova tentativa. Pub/Sub é complementar e não
substitui o Stream consumido pelo serviço de e-mail.

### Serviço de e-mail — consumo e envio

```mermaid
flowchart LR
  stream[(Redis Stream)]
  consumer["src/services/emailStreamConsumer.py<br/>_process_message"]
  backend["PrimeMotors-backend<br/>internalRoutes.ts +<br/>internalEmailController.ts"]
  controller["src/controllers/emailController.py<br/>handle_proposal_created"]
  idem["src/services/emailIdempotencyService.py<br/>lock e chaves de sucesso"]
  rate["src/services/emailRateLimitService.py<br/>reserva de cotas"]
  model["src/models/proposalModel.py<br/>estado de envios"]
  db["src/database/connection.py"]
  email["src/services/emailService.py<br/>send_customer_proposal_email<br/>send_internal_proposal_notification"]
  redis[(Redis)]
  mysql[(MySQL do serviço)]
  smtp[Provedor SMTP]

  stream --> consumer
  consumer -->|GET autenticado com X-Service-Token| backend
  consumer -->|chamada local no processo| controller
  controller --> idem
  controller --> rate
  controller --> model
  controller --> email
  idem --> redis
  rate --> db
  model --> db
  db --> mysql
  email --> smtp
  consumer -->|XACK após sucesso;<br/>retry ou dead-letter em falha| stream
```

O consumer confirma a mensagem somente depois do processamento bem-sucedido;
falhas transitórias são tentadas novamente e eventos inválidos são enviados à
dead-letter. A idempotência reduz reenvios, mas SMTP e bancos não participam de
uma transação distribuída, portanto o fluxo não garante entrega exactly-once.
