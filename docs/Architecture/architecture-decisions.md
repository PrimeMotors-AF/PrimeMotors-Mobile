# Decisões arquiteturais

Este registro descreve as decisões refletidas no código e na configuração
atual do sistema.

## ADR-001 — Monólito modular para a API principal

- **Estado:** implementado.
- **Decisão:** a API principal usa Node.js, Express e Prisma, organizada por
  rotas, controllers, serviços e módulos de domínio no mesmo processo.
- **Evidência:** os módulos de autenticação, usuários, catálogo, favoritos,
  propostas e test drives compartilham a aplicação e o banco transacional.
- **Consequência:** esses módulos são implantados juntos; o serviço de e-mail
  permanece em processo e container separados.

## ADR-002 — MySQL e Prisma para dados transacionais

- **Estado:** implementado.
- **Decisão:** MySQL é a persistência transacional da API principal, acessada
  pelo Prisma. O serviço de e-mail mantém um banco MySQL próprio, acessado por
  SQLAlchemy e gerenciado com Alembic.
- **Evidência:** schema Prisma, migrations, constraints relacionais e serviços
  MySQL declarados no Compose.
- **Consequência:** o MySQL mantém a fonte de verdade de usuários, veículos,
  propostas, favoritos e agendamentos; Redis não substitui esses dados.

## ADR-003 — Redis para cache, limitação de requisições e eventos

- **Estado:** implementado.
- **Decisão:** Redis 7 fornece cache de leitura de veículos, rate limiting,
  Redis Pub/Sub para notificação complementar e Redis Streams para o fluxo
  durável de notificações de propostas.
- **Evidência:** cache-aside com TTL, scripts de rate limit, publisher da
  Outbox, subscriber Pub/Sub e consumer group do serviço de e-mail.
- **Consequência:** falhas de leitura do cache permitem fallback ao MySQL; o
  rate limiter responde `503` quando Redis não está disponível. O e-mail é
  processado a partir do Stream, não do subscriber Pub/Sub de observação.

## ADR-004 — Outbox transacional e Redis Stream

- **Estado:** implementado.
- **Decisão:** a proposta e sua intenção de notificação são gravadas na mesma
  transação MySQL. Um dispatcher publica os eventos pendentes no Stream
  `email.confirmations`.
- **Evidência:** cada linha da Outbox possui tentativas, próxima data de
  execução e lease. Falhas de publicação recebem retry exponencial, limitado a
  15 minutos. O consumer usa grupo Redis, recupera mensagens pendentes e envia
  `XACK` após o processamento bem-sucedido.
- **Consequência:** a entrega é at-least-once. O evento contém identificadores
  e metadados; o consumer obtém os dados da proposta por endpoint interno
  autenticado.

## ADR-005 — Serviço de e-mail em FastAPI

- **Estado:** implementado.
- **Decisão:** notificações de propostas são processadas por uma aplicação
  Python/FastAPI separada, com consumer Redis Stream, persistência MySQL,
  SQLAlchemy/Alembic e envio SMTP.
- **Evidência:** no Compose principal, a API e o consumer executam no container
  `email-service`; o MySQL do serviço é um container separado. O consumer busca
  detalhes da proposta no backend por HTTP autenticado e usa timeout de 10
  segundos. A conexão SMTP usa timeout de 15 segundos.
- **Consequência:** o consumer controla retry e recuperação de eventos; a
  idempotência registra separadamente a entrega ao cliente e à equipe.

## ADR-006 — Circuit breaker no publisher da Outbox

- **Estado:** implementado.
- **Decisão:** o `XADD` do Redis Stream executa por um circuit breaker
  independente em cada processo do backend.
- **Comportamento:** cinco falhas consecutivas abrem o circuito por 30
  segundos. Em seguida, uma única operação de sondagem é permitida em
  half-open. Sucesso fecha o circuito; falha inicia novo período aberto.
- **Consequência:** enquanto o circuito está aberto, o publisher falha
  rapidamente e a Outbox agenda novo retry. A janela não descarta o evento,
  que permanece persistido no MySQL até a publicação ser confirmada. O
  `publish` de Redis Pub/Sub é best-effort e não participa desse circuito.

## ADR-007 — DTOs, erros HTTP e logs correlacionados

- **Estado:** implementado.
- **Decisão:** os payloads de autenticação, perfil, proposta, favorito e test
  drive são convertidos e validados na borda da API por DTOs. Erros de rota
  passam por um middleware comum.
- **Contrato de erro:** respostas incluem `error`, `message`, `code` e
  `requestId`; `error` e `message` preservam compatibilidade com os clientes
  existentes. Detalhes inesperados são registrados no servidor e retornam ao
  cliente como erro interno genérico.
- **Logs:** requisições e falhas são emitidas em JSON com timestamp,
  identificador de correlação, método, rota normalizada e status. Corpo,
  query string e valores de identificadores da rota não são incluídos no log
  de acesso.
