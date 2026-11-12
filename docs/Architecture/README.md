# Arquitetura — Prime Motors

Documentação arquitetural e de operação organizada por assunto. O material
descreve o estado observado no repositório e identifica separadamente propostas
que ainda precisam de validação, implementação ou medição.

## Documentos

| Documento | Conteúdo |
|---|---|
| [C4 — arquitetura do sistema](./c4-architecture.md) | Escopo, contexto, containers e implantação observada. |
| [Decisões arquiteturais](./architecture-decisions.md) | ADRs iniciais, alternativas e consequências; inclui a decisão do banco. |
| [Domínio e DDD](./domain-model.md) | Context map, subdomínios e modelo inicial do contexto de Propostas. |
| [APIs e dados](./api-and-data.md) | Contrato OpenAPI, integrações e decisões/pontos pendentes de dados. |
| [Qualidade, resiliência e observabilidade](./quality-resilience-observability.md) | Estado observado, lacunas e plano resumido; aponta para os SLOs detalhados. |
| [Entrega e operação](./delivery-and-operations.md) | CI/CD, deploy, rollback e runbook de indisponibilidade da API. |

## Atendimento à rubrica

| Requisito | Situação documentada |
|---|---|
| C4 de contexto e containers | Diagramas iniciais em [c4-architecture.md](./c4-architecture.md). |
| ADRs de decisões principais e banco | ADRs iniciais, sujeitos à aprovação da equipe, em [architecture-decisions.md](./architecture-decisions.md). |
| Context map, subdomínios e DDD | Proposta conceitual alinhada aos módulos e schema em [domain-model.md](./domain-model.md); os Value Objects e o agregado ainda são candidatos. |
| OpenAPI/Swagger | Contrato em [`../openapi.yaml`](../openapi.yaml), descrito em [api-and-data.md](./api-and-data.md). |
| Desempenho, disponibilidade e resiliência | SLOs são propostas; há mecanismos implementados e lacunas descritas em [quality-resilience-observability.md](./quality-resilience-observability.md). |
| Observabilidade | Plano documentado; instrumentação centralizada e alertas ainda pendentes. |
| CI/CD | Workflow de validação e deploy manual protegido, conforme [delivery-and-operations.md](./delivery-and-operations.md). |
| Deploy, rollback e runbook | Deploy Compose manual; rollback sem automação e procedimento inicial de indisponibilidade da API em [delivery-and-operations.md](./delivery-and-operations.md). |

## Referências relacionadas

- [SLOs, SLIs e plano de observabilidade](../../QUALITY_RESILIENCE_OBSERVABILITY.md)
- [Documentação do serviço de e-mail](../email-service.md)
- [Workflow CI/CD](../../.github/workflows/ci-cd.yml)
