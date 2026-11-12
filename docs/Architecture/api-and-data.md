# APIs, integração e dados

## Contrato OpenAPI

A especificação OpenAPI 3.1 está em [`../openapi.yaml`](../openapi.yaml). Inclui
as rotas observadas da API principal, autenticação Bearer quando aplicável e
schemas básicos de requisição.

A especificação declara-se inicial: confirmar os schemas detalhados e códigos
de resposta com os controllers antes de usá-la como contrato de geração de
clientes. Mantê-la sincronizada com as rotas e validá-la no CI.

O serviço de email e seu fluxo Redis/HTTP estão descritos em
[`../email-service.md`](../email-service.md).

## Persistência e integração

O backend usa MySQL e Prisma; o schema relaciona usuários, carros, categorias,
marcas, favoritos, propostas e test drives. Redis é usado de forma
complementar para cache, rate limiting e transporte de eventos. A proposta e
sua linha Outbox são registradas na mesma transação para preservar a intenção
de notificação.

A integração com o serviço de email ocorre por Redis Stream com identificadores
de proposta; o consumer obtém os dados necessários por um endpoint interno
autenticado. O banco do serviço de email é separado.

## Decisões e pontos pendentes de dados

Os motivos e consequências da escolha do banco estão documentados em
[Decisões arquiteturais](./architecture-decisions.md#decisao-do-banco-de-dados).

Pontos ainda pendentes:

- definir política de backup e testar restauração;
- definir retenção e monitoramento do Outbox/Stream;
- aplicar migrations em deploy com estratégia compatível;
- medir volume, concorrência e latência antes de alterar o banco.

A configuração presente não demonstra replicação, failover ou recuperação de
desastre.
