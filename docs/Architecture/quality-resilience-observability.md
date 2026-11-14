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

## Estimativas iniciais de desempenho

Os valores abaixo são **alvos de referência para os primeiros testes**, não
medições nem garantias da aplicação. Sem um teste controlado, dados de hardware,
volume de tráfego e configuração de produção, não é confiável estimar capacidade
em requisições por segundo. Revisar os limites após coletar uma linha de base
representativa.

| Componente/indicador | Estimativa ou alvo inicial | Como medir |
|---|---|---|
| Latência da API | p95 ≤ 1.000 ms, alinhado ao SLO proposto no documento detalhado | Duração por rota no log de acesso do Nginx ou instrumentação da API; gerar carga com k6 ou Artillery. |
| Erros da API sob carga | ≤ 1% de respostas 5xx/timeouts; excluir 4xx e 429 intencionais | Relatório do teste de carga e métricas agrupadas por status. |
| Consultas MySQL | Investigar consultas individuais acima de 200 ms; é um limite inicial de diagnóstico, não um SLO | Medir duração no backend; analisar consultas lentas com `EXPLAIN ANALYZE` e Performance Schema. |
| Operações Redis | Investigar operações acima de 50 ms; é um limite inicial de diagnóstico, não um SLO | Medir duração no cliente Redis; usar `SLOWLOG GET` e `LATENCY DOCTOR` para diagnóstico. |
| Core Web Vitals | LCP ≤ 2,5 s; INP ≤ 200 ms; CLS ≤ 0,1 | Lighthouse/Chrome DevTools em laboratório e coleta de `web-vitals` em usuários reais para o p75. |
| Vazão sustentável | Ainda não estimada | Aumentar gradualmente usuários virtuais até p95 ou erros ultrapassarem os limites; registrar a maior vazão que os mantém dentro da meta. |

A captura local do frontend registrada no documento detalhado apresentou LCP
de 2,66 s, INP de 17 ms e CLS de 0. É uma observação pontual de laboratório,
não uma estimativa de produção nem o p75 de usuários reais.

### Roteiro de medição

1. Executar os testes em ambiente identificado, anotando CPU/memória, versões,
   rede, configuração do banco, quantidade de dados e commit testado.
2. Separar cenários de cache frio e aquecido; testar leitura e escrita nas rotas
   mais usadas, além de uma execução curta com as dependências indisponíveis.
3. Com k6 ou Artillery, aquecer a aplicação e aumentar a carga em etapas.
   Registrar requisições por segundo, concorrência, p50/p95/p99, timeouts e 5xx;
   não usar um único pico como capacidade sustentável.
4. No frontend, repetir Lighthouse ou Chrome DevTools pelo menos cinco vezes
   com viewport e condições de rede iguais; comparar mediana e p75. Para campo,
   coletar Core Web Vitals reais, sem misturá-los com dados de laboratório.
5. Correlacionar latência da aplicação com logs do Nginx, duração de consultas
   MySQL, latência Redis e uso de CPU/memória (`docker stats`). Guardar amostras,
   janela e condições para que o resultado possa ser reproduzido.

No estado atual, os logs do Nginx ajudam a medir duração e status, mas ainda não
há métricas centralizadas nem histórico contínuo. Portanto, os resultados devem
ser apresentados como medições do teste e ambiente específicos; não declarar
SLO cumprido sem amostras de produção na janela definida.

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
  [`../Services/email-service/email-service.md`](../Services/email-service/email-service.md).
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
