# Qualidade, resiliência e observabilidade

## SLOs e SLIs

As metas de disponibilidade, latência e Core Web Vitals são propostas e ainda
não foram medidas nem garantidas. A definição detalhada dos SLIs/SLOs, a
evidência pontual de performance do frontend e as instruções para comprovação
estão em
[`../../QUALITY_RESILIENCE_OBSERVABILITY.md`](../../QUALITY_RESILIENCE_OBSERVABILITY.md).

SLI adicional proposto:

| SLI | SLO inicial sugerido | Como medir |
|---|---|---|
| Publicação de evento de proposta | 99% publicados em até 1 minuto | Tempo entre criação do Outbox e `publishedAt`; contar pendências e retries. |

## Resiliência observada

- Health checks de MySQL, Redis, API e frontend no Compose; a API sinaliza
  readiness após consultar MySQL e Redis.
- Reinício dos containers configurado como `unless-stopped`.
- Cache de carros com TTL de 300 segundos por padrão. Falha de leitura de cache
  recorre ao MySQL; falha de escrita no cache é registrada sem impedir a
  resposta da leitura.
- Rate limit distribuído no Redis; se Redis falha, a API retorna `503` para
  aquela requisição (comportamento fail-closed).
- Outbox com lease, tentativas e backoff exponencial (máximo de 15 minutos);
  Stream com limite aproximado de 10.000 eventos e retenção de 30 dias.
- A API do serviço de email persiste a proposta, mantém limite distribuído de
  envios no MySQL próprio e registra separadamente o estado dos dois emails. O
  consumer usa `XACK` após sucesso, com reprocessamento de pendências. A
  garantia é at-least-once, não exactly-once; consulte
  [`../email-service.md`](../email-service.md).
- Encerramento gracioso do servidor fecha o HTTP server e conexões Prisma/Redis.

## Lacunas e estratégia recomendada

- Não há evidência de timeout explícito para operações HTTP de saída ou
  circuit breaker; adicionar deadlines por dependência e circuit breaker apenas
  para chamadas remotas suscetíveis a falhas, com limites e testes.
- Definir o comportamento quando MySQL ou Redis ficam indisponíveis e alertar
  sobre falhas de readiness; não tratar retry como solução para falhas
  permanentes.
- Validar a operação do consumer de email: alertar sobre pendências antigas e
  eventos na dead-letter; executar testes de falha/recuperação em integração.
  O fluxo precisa de validação end-to-end com Redis, MySQL e SMTP do ambiente
  alvo.
- Rever retenção/limite do Stream com base em volume, latência do consumidor e
  janela de recuperação; acompanhar Outbox pendente e eventos mais antigos.
- Aplicar timeout nas requisições entrantes e limites de payload; revisar a
  configuração de proxies e timeouts do Nginx para produção.

## Plano mínimo de observabilidade

- **Métricas:** requisições por rota/status; latência p50/p95/p99; erros 5xx e
  429; readiness; conexões e latência MySQL/Redis; cache hits/misses; limite de
  conexões; volume e idade do Outbox pendente; tentativas/falhas de publicação;
  tamanho e atraso do consumer group; saúde do Nginx e uso de CPU/memória.
- **Logs estruturados:** timestamp UTC, nível, serviço/ambiente, rota,
  método/status, duração, request/correlation ID, `eventId` e erro resumido.
  Não registrar senhas, tokens JWT, CPF, email ou conteúdo de propostas.
- **Alertas iniciais:** readiness indisponível por 2 minutos; taxa 5xx > 5% em
  5 minutos com volume mínimo; p95 acima do SLO por 10 minutos; Outbox mais
  antigo que 5 minutos; crescimento contínuo de retries; falha/atraso do
  consumidor acima da janela definida.
- **Estado de implementação:** logs de containers vão para stdout/stderr com
  rotação Docker configurada; isso não substitui agregação centralizada,
  métricas, dashboards, tracing ou alertas. Selecionar e configurar essas
  ferramentas ainda é uma etapa operacional pendente.
