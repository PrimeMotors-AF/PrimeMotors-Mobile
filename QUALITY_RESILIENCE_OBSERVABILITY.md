# Qualidade, resiliência e observabilidade — PrimeMotors

> **Status:** metas de SLO propostas, não resultados medidos. Foi adicionada uma
> captura local pontual de performance do frontend; ela não representa uma
> medição histórica nem dados de usuários reais.

## 1. Escopo e arquitetura

Este documento considera a versão web do aplicativo servida pelo Nginx, a API
Node/Express, o MySQL e o Redis definidos no Docker Compose. O aplicativo
também pode ser executado em dispositivos Expo; nesse caso, as chamadas à API
usam timeouts configurados nos clientes móveis.

Fluxo web: cliente → Nginx → API → MySQL/Redis. O backend usa Redis para cache,
limitação de requisições e publicação de eventos da outbox. O serviço de e-mail
usa SMTP.

## 2. SLIs e SLOs propostos

**SLI** é a medida observada; **SLO** é o objetivo acordado para essa medida.
As metas são sugestões iniciais e devem ser revistas após uma linha de base de
pelo menos 2 a 4 semanas.

| SLI | Definição de medição | SLO inicial sugerido |
|---|---|---|
| Disponibilidade da API | Requisições de negócio concluídas sem erro 5xx ou timeout ÷ total de requisições de negócio. Excluir health checks e respostas 4xx/429, que representam validação ou limitação intencional. | ≥ 99,0% por mês |
| Latência da API | Percentil 95 da duração das requisições de negócio, medido no Nginx ou na API. Excluir health checks. | p95 ≤ 1.000 ms por mês |
| Prontidão dos serviços | Verificações periódicas de `GET /health/ready` que retornam 200 ÷ verificações realizadas. Esse endpoint verifica MySQL e Redis. | ≥ 99,0% por mês |
| Erros da API | Requisições de negócio que terminam em 5xx ou timeout ÷ total de requisições de negócio. | ≤ 1,0% por mês |
| Core Web Vitals (campo) | Percentil 75 das experiências reais de carregamento/interação, segmentado por dispositivo quando houver volume suficiente. | LCP ≤ 2,5 s; INP ≤ 200 ms; CLS ≤ 0,1 |

Com disponibilidade de 99% em um mês de 30 dias, o orçamento de indisponibilidade
é aproximadamente 7 h 12 min. Para cada SLI, registrar período, amostra,
numerador e denominador; não declarar cumprimento do SLO sem esses dados.

## 3. Estado atual e evidências no código

| Item | Implementado | Evidência / observação |
|---|---|---|
| Verificação de prontidão da API | Sim | `GET /health/ready` consulta MySQL e Redis e retorna 503 se algum deles falhar. |
| Health checks do Compose | Sim | MySQL, Redis, API e frontend web têm verificações; dependências usam `service_healthy`. Os quatro serviços usam `restart: unless-stopped`, política que não reinicia containers explicitamente parados. O health check sinaliza o estado, mas não equivale por si só a um circuit breaker ou a uma garantia de recuperação automática. |
| Timeout no cliente Mobile | Sim | Cliente Axios do Expo: 5 s; cliente Axios em `Mobile/src/services/api.ts`: 10 s. |
| Timeout no proxy web | Sim | Nginx: `proxy_connect_timeout` 5 s, `proxy_send_timeout` 60 s e `proxy_read_timeout` 60 s. |
| Timeout no envio SMTP | Sim | Conexão SMTP configurada com 15 s no serviço de e-mail. |
| Retry de eventos | Sim, em escopo específico | Dispatcher da outbox tenta publicar eventos novamente com backoff exponencial até 15 min, executa ciclos a cada 1 s e processa até 25 eventos por ciclo. O evento é persistido antes da publicação. Isso não configura retry geral das requisições HTTP. |
| Fallback do cache | Parcial | Falha ao ler cache Redis de carros é registrada e a leitura pode seguir pelo MySQL. Erros de escrita do cache são registrados. A invalidação do cache registra e propaga o erro. |
| Rate limiting | Sim | Limites da API e autenticação são armazenados no Redis. Se Redis falhar, o middleware responde 503; não há fallback aberto. |
| Circuit breaker | Não identificado | Não foi encontrada implementação de circuit breaker para chamadas a dependências externas. |
| Logs de acesso | Sim, no Nginx | Saída em stdout/stderr com status, duração, upstream e `request_id`; logs de erro em nível `warn`. |
| Rotação de logs | Sim, no Compose | Para os serviços configurados: `json-file`, até 10 MB por arquivo e 3 arquivos. |
| Métricas e monitoramento contínuo | Não identificado | Não foi encontrada instrumentação de métricas nem plataforma de dashboards/alertas no repositório. |

### Referências de implementação

- `PrimeMotors-backend/src/app.ts`: endpoint de prontidão e rotas da API.
- `PrimeMotors-backend/src/server.ts`: inicialização e encerramento do servidor.
- `PrimeMotors-backend/src/services/proposalOutbox.ts`: retry e ciclo da outbox.
- `PrimeMotors-backend/src/services/carCache.ts`: cache-aside e fallback de leitura.
- `PrimeMotors-backend/src/middlewares/rateLimit.ts`: limites de requisição.
- `Mobile/src/services/api.ts`: timeout do cliente Expo.
- `PrimeMotors-FrontEnd/src/services/api.ts`: timeout do cliente web.
- `Mobile/nginx.conf`: timeouts do proxy e formato do log de acesso.
- `PrimeMotors-docker/docker-compose.yml`: health checks, dependências, reinício e rotação de logs.
- `PrimeMotors-Email-Service/src/services/emailService.py`: timeout SMTP.

## 4. Estratégias de resiliência

### Já aplicadas

1. **Timeouts:** limitam a espera no cliente móvel, no proxy Nginx e na conexão
   SMTP. Os valores variam por camada e estão listados na tabela acima.
2. **Retry com backoff exponencial:** aplicado à publicação de eventos da outbox
   no Redis Stream, com atraso máximo de 15 minutos. Não repetir automaticamente
   operações de escrita HTTP sem idempotência.
3. **Persistência da outbox:** o evento é gravado junto com a operação de negócio
   no MySQL e pode ser republicado após falha do Redis.
4. **Fallback de cache:** falha de leitura do cache de carros permite consultar o
   MySQL, evitando que a indisponibilidade do cache interrompa essa leitura.
5. **Health checks e reinício de containers:** o Compose espera por dependências
   saudáveis antes de iniciar os consumidores e tenta reiniciar serviços
   configurados com `unless-stopped`.
6. **Rate limiting:** reduz abuso e limita carga, embora dependa do Redis.

### Lacunas e ações sugeridas

- Não há circuit breaker identificado. Avaliar sua inclusão para integrações
  externas com falhas recorrentes, definindo limiares, estado half-open e
  recuperação; não afirmar que já está aplicado.
- O rate limiter falha fechado (503) se o Redis estiver indisponível. Validar se
  essa decisão é apropriada para produção e documentar o comportamento esperado.
- Adicionar métricas de duração, contagem por status, timeouts e saúde das
  dependências para calcular os SLIs acima.
- Definir se `/health/ready` deve incluir Redis: atualmente sim; portanto a API
  não é considerada pronta se MySQL ou Redis estiver indisponível.

## 5. Plano simples de observabilidade

### Métricas

Coletar, no mínimo, a cada 30 a 60 segundos:

- total de requisições por método, rota normalizada e código HTTP;
- duração das requisições (histograma), com p50, p95 e p99;
- taxa de timeout e de respostas 5xx;
- resultado e duração do health check da API;
- disponibilidade/conexões e erros de MySQL e Redis;
- cache hit/miss e falhas de leitura/escrita;
- eventos pendentes, idade do evento mais antigo e tentativas da outbox;
- reinícios e estado dos containers.

Evitar labels de alta cardinalidade, como IDs de usuário, proposta ou veículo.

### Logs

- Centralizar stdout/stderr dos containers e manter a rotação já configurada.
- Preservar `request_id` para relacionar log do Nginx e da API; atualmente o
  Nginx o encaminha como `X-Request-ID`, mas a aplicação deve ser verificada para
  garantir que o propaga nos logs.
- Registrar timestamp UTC, serviço, ambiente, nível, rota normalizada,
  status/duração e identificador de correlação.
- Não registrar senhas, tokens, cabeçalhos de autorização, corpo de requisição
  nem dados pessoais. Restringir acesso e definir prazo de retenção.

### Alertas iniciais

- API sem prontidão por 3 verificações consecutivas;
- disponibilidade abaixo de 99% ou p95 acima de 1.000 ms no período observado;
- taxa de 5xx acima de 1% por 5 minutos;
- dependência indisponível ou aumento persistente de timeouts;
- outbox com eventos pendentes por mais de 5 minutos ou fila crescente.

Os limiares são propostas iniciais. Ajustar após obter linha de base e considerar
volume mínimo de amostras para evitar alertas causados por baixo tráfego.

## 6. Evidência pontual de performance do frontend

Foi inspecionada a rota local `http://localhost:8081/explorar` com as ferramentas
de performance do Chrome. Os valores abaixo foram transcritos das capturas
fornecidas; não há registro da configuração de rede/dispositivo nem repetição
controlada dos testes.

| Indicador observado | Valor na captura | Leitura |
|---|---:|---|
| LCP | 2,66 s | Acima do valor de referência “bom” de 2,5 s; oportunidade de melhoria. |
| INP | 17 ms | Abaixo do valor de referência “bom” de 200 ms. Captura local pontual, não p75 de usuários reais. |
| CLS | 0 | Abaixo do valor de referência “bom” de 0,1 na captura. |
| Duração do perfil de Performance | 7,13 s | Janela total mostrada no resumo da gravação, não latência de uma requisição individual. |
| Atividade de scripting | 1.186 ms | Tempo atribuído a scripting no resumo da gravação. |
| Atividade de sistema | 307 ms | Tempo atribuído a system no resumo da gravação. |
| Rendering / painting | 52 ms / 15 ms | Tempos mostrados no resumo da gravação. |
| Transferência atribuída a localhost | 6.158 kB | Valor mostrado no resumo por origem; investigar tamanho do bundle e recursos locais. |
| Transferência atribuída a Cloudinary | 8.145 kB | Valor exibido para Cloudinary no resumo por origem; revisar formatos, dimensões e compressão das imagens. |

O painel também estimou oportunidades de economia de aproximadamente **795 ms e
43 kB** para latência da requisição do documento, **2,3 MB** para entrega de
imagens e **685 ms** para exibição de fontes. São estimativas do Chrome, não
reduções já obtidas nem garantias de ganho após mudanças.

### Ações recomendadas a partir da captura

1. Repetir a medição em sessão anônima, sem extensões, com viewport e condições
   de rede/dispositivo registradas; fazer ao menos cinco execuções e comparar
   mediana e p75.
2. Investigar o LCP de 2,66 s: identificar o elemento LCP e priorizar sua
   resposta/decodificação; reduzir recursos que bloqueiam renderização.
3. Auditar os recursos do Cloudinary: servir dimensões apropriadas ao viewport,
   formatos modernos e compressão; evitar carregar imagens fora da tela antes
   de serem necessárias.
4. Verificar carregamento de fontes (`font-display`) e reduzir CSS/JS que
   bloqueiam a primeira renderização, validando cada mudança por nova gravação.
5. Não usar os valores desta captura como SLO de produção. Para isso, coletar
   Core Web Vitals de usuários reais e acompanhar o p75 por janela definida.

## 7. Como comprovar o quesito

1. Apresentar este documento e apontar os arquivos de evidência listados.
2. Executar os health checks e demonstrar respostas saudável e indisponível
   (`200` e `503`) em ambiente controlado.
3. Mostrar configuração de timeout e retry e, se possível, um teste que simule
   indisponibilidade da dependência.
4. Para frontend, anexar gravações repetíveis com dispositivo, rede, rota e
   condições de teste identificadas; diferenciar estimativas de economia de
   resultados confirmados.
5. Para declarar SLO cumprido, anexar relatório do período com SLIs calculados,
   janela, total de amostras e fonte dos dados. Até existir esse histórico,
   descrever as metas como **propostas**, não como desempenho alcançado.

## 8. Registro de revisão

| Versão | Data | Alteração |
|---|---|---|
| 1.0 | 2026-11-03 | Registro inicial baseado nas configurações presentes no repositório; metas propostas, ainda não medidas. |
| 1.1 | 2026-11-03 | Incluídas capturas locais do Chrome para `/explorar`, interpretação dos Core Web Vitals e ações recomendadas; estimativas mantidas separadas de resultados. |
