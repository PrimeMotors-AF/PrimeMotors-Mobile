# Decisões arquiteturais — ADRs

Os ADRs abaixo são registros iniciais inferidos do código e das configurações
atuais. A equipe deve aprová-los e mantê-los conforme a arquitetura evoluir.

## ADR-001 — Monólito modular

- **Decisão:** manter inicialmente um monólito modular Express, com módulos por
  domínio.
- **Motivo:** rotas, controllers e serviços estão no mesmo backend e
  compartilham dados/transações. Evita o custo operacional de separar serviços
  sem necessidade comprovada.
- **Consequências:** uma separação futura exige limites de módulo e interfaces
  explícitas.

## ADR-002 — MySQL e Prisma

- **Decisão:** usar MySQL como fonte transacional e Prisma como camada de
  persistência.
- **Motivo:** o schema Prisma define relações, unicidade e enums; as migrations
  existentes e a configuração do Compose usam MySQL. O adaptador aceita URLs
  `mysql://` e `mariadb://`.
- **Consequências:** migrations e backups precisam ser geridos para MySQL
  compatível.

## ADR-003 — Redis complementar

- **Decisão:** usar Redis para cache de leitura, rate limiting e integração
  assíncrona de propostas.
- **Motivo:** esses mecanismos estão implementados no backend.
- **Consequências:** Redis não substitui MySQL como fonte de verdade. A API
  falha fechada no rate limiter quando Redis está indisponível e falha aberta
  no cache de leitura.

## ADR-004 — Outbox e Redis Stream

- **Decisão:** registrar a proposta e o evento Outbox na mesma transação e
  publicar o evento depois no Redis Stream.
- **Motivo:** evita confirmar proposta sem registrar a intenção de notificar.
- **Consequências:** o dispatcher usa lease e retry exponencial. O consumer lê
  eventos com IDs, busca o payload por rota interna autenticada e processa o
  email com consumer group, recuperação de pendências e `XACK` após sucesso.
  Consulte [email-service.md](../email-service.md).

## ADR-005 — Serviço de notificações em Python

- **Estado:** decisão atual observada; justificativa a validar pela equipe.
- **Contexto:** o envio de emails de propostas é assíncrono, iniciado por
  eventos no Redis Stream. O serviço busca dados da proposta no backend, valida
  o payload, controla retries/idempotência e persiste o resultado dos envios.
- **Decisão:** manter o serviço separado em Python com FastAPI, Pydantic,
  consumer Redis assíncrono, SQLAlchemy/Alembic e envio SMTP.
- **Alternativas consideradas:** incorporar o fluxo ao backend TypeScript/
  Express ou implementá-lo como outro serviço Node.js. Não há benchmarks no
  repositório que demonstrem vantagem de desempenho de Python; a decisão se
  baseia na separação funcional e nas bibliotecas já usadas.
- **Consequências:** o serviço pode evoluir e ser implantado independentemente,
  mas exige manutenção de dois runtimes, dependências, pipelines e práticas de
  observabilidade. A comunicação entre serviços precisa permanecer explícita e
  autenticada. O uso de Python não implica migração do backend principal.

## Decisão do banco de dados

O projeto usa MySQL 8 no Compose e Prisma para acesso relacional. O schema tem
relações entre usuários, carros, categorias, marcas, favoritos, propostas e
test drives, além de constraints de unicidade e migrations versionadas. Essa
escolha permite transações e integridade referencial, inclusive para gravar uma
proposta e sua linha Outbox atomicamente. Redis é complementar: cache, rate
limiting e transporte de eventos, não a persistência principal.

**Consequências e decisões pendentes:** definir política de backup e teste de
restauração; retenção e monitoramento do Outbox/Stream; aplicar migrations em
deploy com estratégia compatível; medir volume, concorrência e latência antes
de alterar o banco. A configuração presente não demonstra replicação, failover
ou recuperação de desastre.
