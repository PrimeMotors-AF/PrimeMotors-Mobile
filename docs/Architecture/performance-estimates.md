# Estimativas e plano de medição de desempenho

> **Status:** metas abaixo são propostas. Foram adicionadas medições pontuais do
> frontend e um teste de carga da API realizado em 14/11/2026. O teste durou
> minutos e ocorreu em ambiente compartilhado; não comprova cumprimento de SLO
> mensal nem representa a capacidade de um servidor dedicado.

## Confiabilidade, Resiliência e Observabilidade

Para a API, usar como referência os SLOs da seção 2 de
[`../../QUALITY_RESILIENCE_OBSERVABILITY.md`](../../QUALITY_RESILIENCE_OBSERVABILITY.md).
Os valores anteriores de 98% e p95 ≤ 2.000 ms eram metas preliminares da
imagem; para a API, foram substituídos pelos alvos mais específicos abaixo.
Validar as metas após uma linha de base mais longa.

| Categoria | Indicador (SLI) | Meta inicial (SLO) | Janela de medição | Situação |
|---|---|---:|---|---|
| Disponibilidade da API | Requisições de negócio sem 5xx ou timeout ÷ total de requisições de negócio | ≥ 99,0% | 30 dias | Atingida no teste de 90 s; falta histórico mensal |
| Latência da API | p95 das requisições de negócio, sem health checks | ≤ 1.000 ms | 30 dias | Atingida no teste de 90 s até 50 usuários; falha a partir de 100 |
| Erros da API | Requisições 5xx ou timeout ÷ total de requisições de negócio | ≤ 1,0% | 30 dias | Atingido no teste de 90 s até 50 usuários; falha a partir de 100 |
| Prontidão dos serviços | Verificações `GET /health/ready` com status 200 | ≥ 99,0% | 30 dias | 100% no teste; falta histórico mensal |
| Vazão (throughput) | Requisições processadas por segundo sob carga | ≥ 150 req/s (meta de teste) | Teste de carga e pico | Superada a 50 usuários no ambiente testado; capacidade maior não sustentou os SLOs |
| Saturação | CPU e memória do host/containers durante carga representativa | ≤ 80% de cada recurso | Contínua, agregada em intervalos de 5 min | Proposta; faltam séries temporais |
| Freshness (dados) | Atraso entre criação do evento e processamento/publicação | p99 ≤ 30 s | 30 dias | Proposta; falta medir o atraso continuamente |
| Recuperação (MTTR) | Tempo entre detecção/registro do incidente e restauração do serviço | ≤ 15 min | Por incidente | Proposta; faltam registros de incidentes |

**Estratégias de resiliência utilizadas:** o Nginx aplica timeout de 5 s para
conexão com a API e de 60 s para envio e leitura; o backend verifica MySQL e
Redis na prontidão, limita requisições usando Redis e tenta novamente a
publicação da Outbox com backoff. Há blocos `try/catch` em controllers e
serviços, com erros registrados por `console.error`. Esses tratamentos são
seletivos: não foi identificado um middleware global de erro HTTP que registre
automaticamente todas as exceções. Portanto, não afirmar que todas as exceções
não tratadas já são capturadas.

### Plano de observabilidade (coleta manual)

O Nginx registra cada requisição no `stdout` com horário, requisição (método e
rota), status HTTP, `request_id`, duração total (`request_time`) e duração do
upstream (`upstream_response_time`); os tempos são emitidos em segundos e podem
ser convertidos para milissegundos multiplicando por 1.000. O `error_log` do
Nginx vai para `stderr` no nível `warn`. O backend também escreve eventos de
inicialização, prontidão, Redis, Outbox e erros em `stdout`/`stderr`, incluindo
erros capturados em `try/catch`; quando `console.error` recebe um objeto
`Error`, sua pilha é exibida no terminal. Para apresentar o acesso no formato
solicitado, converter e anotar cada linha como
`[Data/Hora] - [Método] - [Rota] - [Status HTTP] - [Tempo em ms]`; o método e a
rota vêm de `$request`, e o tempo em ms é `request_time × 1.000`. Para fins
acadêmicos, consultar os registros no terminal pelos logs dos containers e
executar requisições simuladas manualmente, anotando status e tempo. As
capturas do Chrome DevTools servem para avaliar o frontend. Não há plataforma
de métricas, dashboard ou coleta contínua configurada; a rotação dos logs
também significa que eles não provam, por si só, a disponibilidade histórica
de 30 dias.

Para a meta de disponibilidade de 99%, o orçamento é cerca de 7 h 12 min em
um mês de 30 dias. Excluir health checks, erros de validação (4xx) e respostas
429 intencionais; contabilizar timeouts e falhas 5xx. Registrar numerador,
denominador e volume mínimo de amostras.

**Interpretação da meta de 150 req/s:** foi ultrapassada no teste sustentado de
50 usuários, mas isso não significa que a API sustente cargas maiores dentro
dos SLOs. A 100 e 200 usuários, a vazão bruta aumentou enquanto disponibilidade,
latência e erros ultrapassaram os limites.

## Resultados do carregamento inicial — amostra informada

| Categoria | Indicador (SLI) | Meta definida (SLO) | Valor medido (evidência) | Status na amostra |
|---|---|---:|---|---|
| Disponibilidade | Requisições válidas sem erro 5xx | ≥ 99,0% | 100%: 37 de 37 respostas com status 200, 204, 304 ou 101 | Atingido na amostra |
| Latência (carregamento) | Largest Contentful Paint (LCP) | ≤ 2.000 ms | 1.260 ms (1,26 s) | Atingido |
| Latência (interatividade) | Interaction to Next Paint (INP) | ≤ 200 ms | 31 ms | Atingido |
| Latência (API/assets) | Tempo de resposta individual de rotas e recursos HTTP | p95 ≤ 1.000 ms | Máximo de 593 ms; maioria entre 1 e 321 ms; API `cars` em 13 ms | Atingido na amostra |
| Estabilidade visual | Cumulative Layout Shift (CLS) | ≤ 0,1 | 0 | Atingido |
| Vazão e tráfego | Requisições e dados processados no carregamento inicial | Suportar carga nominal | 37 requisições; 5,2 MB transferidos / 13,0 MB de recursos | Atingido para esse carregamento |
| Saturação (frontend) | Tempo de scripting na thread principal | Sem bloqueios críticos | 1.117 ms de scripting em janela de 11,23 s (aprox. 10%) | Atingido conforme avaliação informada |

Os status acima descrevem **somente a amostra informada**. Os 37 códigos
contabilizados não incluem 5xx; isso não comprova disponibilidade de 99% ao
longo dos 30 dias. O maior tempo de 593 ms está abaixo de 1.000 ms nesta
amostra, mas não substitui a distribuição por endpoint obtida no teste de carga
abaixo. As 37 requisições do carregamento inicial não demonstram vazão sob
concorrência. O tempo de scripting é uma medida de atividade agregada na
janela, não uma medição direta de CPU/RAM nem, por si só, comprovação de
ausência de tarefas longas; convém verificar os long tasks.

## Resultados da API — teste de carga de 14/11/2026

**Branch:** `feat/MetricasDeDesempenho`  
**Alvo:** API Node/Express (`PrimeMotors-backend`), iniciada com
`tsx src/server.ts`.

### Condições do teste

| Item | Valor |
|---|---|
| Dependências e dados | MariaDB 10.11 e Redis locais; banco populado pelo seed com 15 carros |
| Ambiente | Contêiner Linux com 1 vCPU e 4 GB de RAM, compartilhados pelo gerador, API, MariaDB e Redis |
| Gerador de carga | Script Node próprio; uma amostra por requisição, keep-alive e timeout de 5 s |
| Mix de requisições de negócio | 45% `GET /cars`; 30% `GET /cars/:id`; 10% `GET /users/:id`; 10% `GET /favorites/:id`; 5% `POST /auth/login` |
| Rate limit | Elevado para não limitar artificialmente o teste |
| Exclusões e percentis | Health checks fora das métricas de negócio; p95 e p99 sobre as amostras |

O timeout de 5 s corresponde ao valor do cliente Expo. Como o gerador, a API e
as dependências dividem um único núcleo, os resultados são próprios deste
ambiente e podem ser mais lentos que em um servidor dedicado. As janelas são
curtas e não substituem a apuração dos SLOs mensais.

### Carga sustentada — 50 usuários simultâneos por 90 s

| SLI | SLO de referência | Resultado medido | Numerador / amostras | Status |
|---|---:|---:|---:|---|
| Disponibilidade da API | ≥ 99,0% | 100,00% | 20.480 / 20.480 | Atingido |
| Latência da API (p95) | ≤ 1.000 ms | 406,5 ms | 20.480 amostras | Atingido |
| Erros da API (5xx + timeout) | ≤ 1,0% | 0,00% | 0 / 20.480 | Atingido |

Vazão sustentada: **227,6 req/s**. Latência p50: **19,1 ms**; p99:
**4.292 ms**. Não há SLO p99 definido; o valor alto indica uma cauda longa,
concentrada principalmente no login.

**Prontidão medida separadamente:** `GET /health/ready` teve 100,00% de
sucesso (15.220/15.220), p50 14,0 ms, p95 71,6 ms e p99 99,6 ms. O detalhamento
por endpoint identifica essa medição como executada com 20 usuários, portanto
ela não é apresentada como parte do patamar de 50 usuários da tabela acima.

### Resultados por patamar de carga

Cada patamar durou 20 s e contabiliza requisições de negócio. Os valores da
linha de 50 usuários são de uma execução curta diferente da janela sustentada
de 90 s acima.

| Usuários simultâneos | Vazão | Requisições | Disponibilidade (meta ≥ 99%) | p95 (meta ≤ 1.000 ms) | Erros (meta ≤ 1%) |
|---:|---:|---:|---:|---:|---:|
| 10 | 208,3 req/s | 4.165 | 100,00% — atingido | 587,5 ms — atingido | 0,00% — atingido |
| 50 | 241,9 req/s | 4.839 | 100,00% — atingido | 706,4 ms — atingido | 0,00% — atingido |
| 100 | 365,8 req/s | 7.315 | 96,66% — não atingido | 1.002,3 ms — não atingido | 3,34% — não atingido |
| 200 | 418,9 req/s | 8.377 | 95,39% — não atingido | 2.246,2 ms — não atingido | 4,61% — não atingido |

Até 50 usuários simultâneos, os SLOs foram atingidos nos patamares testados.
Em 100 e 200 usuários, os SLOs foram ultrapassados. A vazão bruta continuou
crescendo, mas não representa capacidade aceitável porque foi acompanhada por
mais erros e maior latência. O intervalo exato de capacidade entre 50 e 100
usuários ainda não foi determinado.

### Latência por endpoint — carga sustentada de 50 usuários

| Endpoint | Requisições | Disponibilidade | p50 | p95 | p99 |
|---|---:|---:|---:|---:|---:|
| `GET /cars` | 9.296 | 100,00% | 16,5 ms | 116,7 ms | 167,8 ms |
| `GET /cars/:id` | 6.047 | 100,00% | 16,1 ms | 118,6 ms | 169,8 ms |
| `GET /users/:id` (auth) | 2.042 | 100,00% | 19,0 ms | 105,0 ms | 156,2 ms |
| `GET /favorites/:id` (auth) | 2.068 | 100,00% | 26,4 ms | 160,1 ms | 221,6 ms |
| `POST /auth/login` | 1.027 | 100,00% | 4.087,6 ms | 4.468,6 ms | 4.614,8 ms |

As rotas de leitura tiveram p95 inferior a 170 ms neste teste. O login foi o
endpoint mais lento: o p50 medido foi 729 ms com 10 usuários e cerca de 4 s
com 50; seu p95 de 4.468,6 ms excede 1.000 ms, embora o SLO informado seja
calculado sobre o p95 agregado da API. Isso evidencia uma cauda lenta que o
resultado agregado não deve ocultar. Todos os erros dos patamares de 100 e 200
usuários ocorreram em `POST /auth/login` e foram timeouts de 5 s; nenhuma outra
rota apresentou erro nos patamares testados. O custo de `bcrypt.compare` em um
único núcleo é uma explicação provável indicada pela análise do teste, mas deve
ser confirmada com perfil de CPU antes de uma otimização.

**Conclusão limitada ao teste:** disponibilidade, p95 e taxa de erros
cumpriram seus SLOs na execução sustentada de 90 s com 50 usuários. A prontidão
atingiu 100% na medição separada de 20 usuários. O teste não comprova SLO
mensal nem comportamento em infraestrutura dedicada.

## Evidências de capturas anteriores

| Página/escopo mostrado | Indicador | Valor observado | Interpretação |
|---|---|---:|---|
| `http://localhost:8081/Garagem` — Chrome DevTools Performance | LCP | 1,25 s | Captura local; abaixo da referência “bom” de 2,5 s, mas sem repetição controlada |
| `http://localhost:8081/Garagem` — Chrome DevTools Performance | INP | 29 ms | Interação observada na captura; não é p75 de usuários reais |
| `http://localhost:8081/Garagem` — Chrome DevTools Performance | CLS | 0 | Sem deslocamento de layout reportado nessa captura |
| `http://localhost:8081/Garagem` — oportunidade do DevTools | Economia estimada na entrega de imagens | 4,5 MB | Oportunidade sugerida pelo navegador; não é economia já obtida |
| `http://localhost:8081/Garagem` — oportunidade do DevTools | Economia estimada na solicitação do documento | 47,8 kB | O painel mostra “Est savings”; é uma estimativa de tamanho, não uma medição de latência |
| `http://localhost:8081/Garagem` — oportunidade do DevTools | Exibição de fontes | 170 ms | Economia estimada pelo painel, não resultado confirmado |
| Métricas locais do Chrome; URL não visível | INP | 16 ms | Métrica local indicada como boa; não é possível atribuí-la a uma rota específica |
| Métricas locais do Chrome; URL não visível | LCP e CLS | Sem valor | A captura mostra “–”; precisam de uma página/carregamento que produza esses indicadores |
| Métricas locais do Chrome; URL não visível | CPU/rede | Sem throttling | Condição mais favorável que muitos dispositivos/redes de usuários; repetir com limitação configurada |

As capturas de `/Garagem` e das métricas locais devem permanecer como evidência
pontual de laboratório. Elas não permitem inferir disponibilidade mensal ou
comportamento do frontend em produção; o teste de carga da API acima não mediu
CPU/memória do host.

## Como medir e validar

1. **Frontend:** repetir a gravação no Chrome DevTools pelo menos cinco vezes
   por rota. Registrar mediana e p75, URL, viewport, dispositivo, versão/commit,
   CPU e rede simuladas e estado do cache.
2. **API e latência:** complementar o teste de carga com requisições manuais às
   rotas críticas e conferir método/rota, status e duração nos logs do Nginx.
   Converter `request_time` de segundos para milissegundos. Não tratar as
   janelas de 20 e 90 segundos como p95 mensal.
3. **Vazão:** o teste observou mais de 150 req/s com SLOs atingidos até 50
   usuários simultâneos. Repetir o teste e aumentar a carga em passos menores
   entre 50 e 100 usuários para localizar o ponto de degradação.
4. **Disponibilidade:** logs consultados manualmente ajudam a localizar falhas,
   mas não oferecem histórico suficiente para calcular o SLO de 30 dias no
   estado atual.
5. **Saturação:** observar manualmente CPU e memória dos containers durante os
   testes e anotar o horário e a carga; isso não substitui uma série contínua.
6. **Freshness:** comparar os horários de criação e publicação dos eventos da
   Outbox quando disponíveis. Definir separadamente como verificar o frescor do
   cache antes de afirmar a meta.
7. **MTTR:** registrar manualmente início, detecção e restauração de cada
   incidente; sem esse histórico, o limite de 15 minutos não está validado.

Ao registrar resultados, usar rotas normalizadas e não incluir IDs de usuários,
tokens, senhas, emails ou outros dados pessoais nos relatórios.

## Itens que ainda faltam analisar

Priorizar as lacunas abaixo antes de declarar cumprimento das metas:

- [ ] **Repetibilidade do frontend:** há uma amostra com LCP 1.260 ms, INP 31 ms
  e CLS 0; repetir `/Garagem` pelo menos cinco vezes em condições registradas e
  testar também em CPU e rede limitadas.
- [ ] **Demais rotas do frontend:** obter capturas completas de páginas críticas
  (por exemplo, perfil e fluxo de proposta); a imagem de métricas locais não
  identifica a URL e não apresenta LCP/CLS.
- [ ] **Economias do DevTools:** inspecionar recursos e validar se as estimativas
  de 4,5 MB, 47,8 kB e 170 ms correspondem a oportunidades aplicáveis; medir
  novamente após eventuais otimizações.
- [ ] **Teste de carga:** o teste de 14/11 atingiu os SLOs até 50 usuários e
  falhou em 100; repetir em ambiente isolado, por mais tempo, e adicionar
  patamares entre 50 e 100 para localizar o limite.
- [ ] **Login e cauda de latência:** `POST /auth/login` teve p95 de 4.468,6 ms
  com 50 usuários e concentrou os timeouts a partir de 100; medir CPU/perfil
  do `bcrypt.compare` e reavaliar o p99 global de 4.292 ms.
- [ ] **Disponibilidade mensal:** o teste de 90 s teve 20.480 de 20.480
  requisições de negócio sem erro; a prontidão teve 15.220/15.220 na medição
  separada de 20 usuários. Coletar dados por 30 dias para confirmar os SLOs.
- [ ] **CPU e memória:** o scripting de frontend foi 1.117 ms em 11,23 s, mas
  não houve medição de CPU/RAM no teste de carga; observar host e containers
  sob carga sustentada e verificar tarefas longas.
- [ ] **Freshness:** instrumentar atraso da Outbox e definir uma métrica separada
  para frescor do cache; verificar o p99 de 30 segundos.
- [ ] **MTTR:** estabelecer processo de registro de incidentes e medir tempo até
  restauração; confirmar se 15 minutos é operacionalmente viável.
- [ ] **Exceções HTTP:** adicionar ou validar um middleware global de erros que
  registre a pilha no `stderr` sem expor detalhes sensíveis ao cliente.
- [ ] **Retenção dos logs:** confirmar por quanto tempo os logs ficam disponíveis
  e se a retenção permite comprovar a janela de 30 dias.
- [ ] **Reprodutibilidade do teste:** preservar o script Node, versões do
  runtime/bibliotecas, configurações e saída bruta; repetir em ambiente
  dedicado para separar o custo do gerador do custo da API e dependências.

## Critério para atualizar este documento

Substituir uma meta proposta por resultado somente com relatório que identifique
ambiente e período, quantidade de amostras, método, numerador/denominador quando
aplicável e valores medidos. Manter resultados de laboratório, dados de campo e
estimativas do navegador em seções distintas.
