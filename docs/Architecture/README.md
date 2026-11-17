# Arquitetura — Prime Motors

Documentação da arquitetura e operação implementadas no repositório.

## Documentos

| Documento | Conteúdo |
|---|---|
| [C4 — arquitetura do sistema](./c4-architecture.md) | Contexto, containers, integrações e implantação Compose. |
| [Decisões arquiteturais](./architecture-decisions.md) | Monólito modular, persistência, Redis, eventos, circuit breaker, DTOs e erros HTTP. |
| [Domínio e DDD](./domain-model.md) | Context map, subdomínios e modelo do contexto de Propostas. |
| [APIs e dados](./api-and-data.md) | Contrato OpenAPI, integrações e persistência. |
| [Qualidade, resiliência e observabilidade](./quality-resilience-observability.md) | SLOs, mecanismos de resiliência e logs observados. |
| [Entrega e operação](./delivery-and-operations.md) | Workflows, deploy Compose, rollback e runbook. |
| [CI do Mobile](./mobile-ci-cd.md) | Gatilhos e validação do export web do Expo. |

## Referências

- [SLOs, SLIs e observabilidade](../../QUALITY_RESILIENCE_OBSERVABILITY.md)
- [Fluxo do serviço de e-mail](../Services/email-service/email-service.md)
- [Especificação OpenAPI](../api/openapi.yaml)
- [Workflow CI/CD do backend](../../.github/workflows/ci-cd.yml)
