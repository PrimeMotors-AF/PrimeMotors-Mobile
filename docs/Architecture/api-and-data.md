# APIs, integração e dados

## Contrato OpenAPI

A especificação OpenAPI 3.1 está em
[`../api/openapi.yaml`](../api/openapi.yaml). Inclui as rotas observadas da API
principal, autenticação Bearer quando aplicável e schemas de requisição. O
workflow de CI valida o arquivo OpenAPI.

O serviço de email e seu fluxo Redis/HTTP estão descritos em
[`../Services/email-service/email-service.md`](../Services/email-service/email-service.md).

## Persistência e integração

O backend usa MySQL e Prisma; o schema relaciona usuários, carros, categorias,
marcas, favoritos, propostas e test drives. Redis é usado de forma
complementar para cache, rate limiting e transporte de eventos. A proposta e
sua linha Outbox são registradas na mesma transação para preservar a intenção
de notificação.

A integração com o serviço de email ocorre por Redis Stream com identificadores
de proposta; o consumer obtém os dados necessários por um endpoint interno
autenticado. O banco do serviço de email é separado.

## Configuração de recuperação

Os motivos e consequências da escolha do banco estão documentados em
[Decisões arquiteturais](./architecture-decisions.md#decisao-do-banco-de-dados).

A configuração presente não demonstra uma política de backup e restauração,
replicação, failover ou recuperação de desastre.
