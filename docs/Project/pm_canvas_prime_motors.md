# PM Canvas: Prime Motors - Plataforma Automotiva Premium

> **Descrição:** Consulta de veículos, propostas e test drives em web, mobile e API.
>
> **Versão:** 1.1
>
> **Atualizado em:** 22/11/2026
>
> **Autores:** Fernando Consolin Rosa, Aitom Henrique Donatoni
>
> **Período do Módulo:** 23/09/2026 a 23/11/2026
>
> **Repositório:** [github.com/PrimeMotors-AF/PrimeMotors-Mobile](https://github.com/PrimeMotors-AF/PrimeMotors-Mobile)

## 1. Justificativa

Centralizar a consulta de veículos premium e o relacionamento do cliente com a loja em um único ecossistema, reunindo catálogo, favoritos, garagem virtual, propostas e agendamento de test drives. Hoje essas informações ficam dispersas entre canais; a plataforma encurta o caminho entre a busca técnica e o fechamento da proposta.

## 2. Objetivo SMART

Até **23/11/2026**, entregar a **versão 1.1** da plataforma em ambiente de homologação, com demonstração na apresentação final, contemplando cadastro e login, catálogo, favoritos, propostas, test drives, perfil e gestão administrativa de propostas validados por:

* **Qualidade:** fluxos principais cobertos por testes automatizados do backend e build web validado no CI.
* **Consistência:** os clientes Expo/Mobile e React/Vite compartilham os contratos da API principal.
* **Resiliência:** proposta persistida e evento registrado na mesma transação, com publicação assíncrona por Outbox/Redis Stream.
* **Observabilidade:** health checks, logs HTTP correlacionados e documentação dos mecanismos de falha disponíveis.

## 3. Benefícios Esperados

* Fluxos de interesse e negociação de veículos mais acessíveis, na web e no celular.
* Notificações de propostas automatizadas por e-mail, com confirmação ao cliente e aviso à equipe.
* Acompanhamento operacional facilitado: administradores alteram o status das propostas em tempo real pelo app.
* Permissões claras entre cliente e administrador (RBAC).
* Experiência multiplataforma, com app Expo nativo e versão web.
* Maior confiança técnica por meio de validação de entrada, testes, CI/CD, cache, rate limiting e retries.

## 4. Produto (Stack Tecnológica)

* **App Mobile:** React Native, Expo 58, Expo Router, NativeWind e Axios
* **Frontend Web:** React 19, Vite, TypeScript e Tailwind CSS
* **API:** Node.js, Express 5, TypeScript, JWT e Prisma
* **Banco de Dados:** MySQL 8
* **Cache, limite e eventos:** Redis 7
* **Notificações:** FastAPI/Python, SQLAlchemy/Alembic, Redis Stream e SMTP
* **Imagens:** Cloudinary
* **Containers e implantação:** Docker Compose, Nginx e GitHub Actions

## 5. Requisitos Principais

* Cadastro, autenticação JWT e controle por perfil.
* Consulta de veículos com filtros, detalhes e especificações.
* Favoritos e garagem virtual.
* Criação, consulta, alteração e exclusão de propostas.
* Gestão administrativa de propostas e status.
* Agendamento, consulta, alteração e exclusão de test drives.
* Perfil de usuário e upload de avatar.
* Processamento assíncrono e envio de notificações por e-mail.

## 6. Stakeholders

* Clientes
* Equipe comercial e administrativa
* Produto
* Desenvolvimento
* Operações e infraestrutura
* Provedor SMTP
* Cloudinary
* Professor orientador (avaliação acadêmica)

## 7. Equipe

| Papel | Responsável |
| :--- | :--- |
| **Product Owner** | Fernando Consolin Rosa |
| **Responsável Técnico** | Aitom Henrique Donatoni |
| **Desenvolvimento** | Fernando Consolin Rosa e Aitom Henrique Donatoni |
| **QA** | Revisão cruzada entre a dupla |
| **Operações** | Aitom Henrique Donatoni |

## 8. Premissas

* MySQL é a fonte de dados transacionais da API; o serviço de e-mail possui banco próprio.
* Redis é usado para cache, rate limit, pub/sub e Redis Stream.
* SMTP e Cloudinary são dependências externas.
* Docker Compose é o ambiente integrado de demonstração e homologação.
* Credenciais são fornecidas por configuração segura do ambiente, nunca versionadas no repositório.

## 9. Entregas

* App Expo: autenticação, explorar, detalhes, favoritos, garagem, perfil, test drive e gestão administrativa de propostas.
* Frontend React/Vite com os principais fluxos do catálogo e relacionamento.
* API REST modular com JWT, RBAC, DTOs, logs correlacionados e health checks.
* Persistência em MySQL com Prisma e migrations.
* Cache de carros, limite de requisições e Outbox transacional.
* Serviço FastAPI de e-mail com consumer Redis, idempotência, limites e SMTP.
* Containers Docker, CI backend/mobile e workflow de deploy manual.
* Testes automatizados do backend e documentação arquitetural, operacional e OpenAPI.

## 10. Restrições

* **Prazo:** 23/11/2026
* **Ambientes:** desenvolvimento local, Docker integrado e homologação; produção limitada à demonstração.
* **Infraestrutura:** Docker Compose, não configurado para alta disponibilidade.
* **Capacidade:** Equipe de duas pessoas em tempo parcial.
* **Qualidade:** Mobile não possui suíte automatizada configurada; o CI valida o export web.
* **Observabilidade:** ainda não há métricas contínuas, dashboards ou alertas centralizados.

## 11. Riscos e Mitigação

| Risco | Resposta / Plano de Ação |
| :--- | :--- |
| **Indisponibilidade do Redis** atrasar cache, limite de requisições ou publicação de notificações. | Outbox retém eventos no MySQL; rate limiter falha fechado com `503`; restaurar Redis e reprocessar pendências. |
| **Falhas de SMTP** atrasarem ou impedirem entregas. | Consumer aplica retry/backoff, persistência de estado e idempotência por proposta. |
| **Mudanças de schema** exigirem implantação coordenada. | Utilizar *migrations* versionadas. |
| **Escopo em andamento** com prazo curto para duas pessoas. | Priorizar estritamente os fluxos principais (MVP). |
| **Entrega exatamente única de e-mail** não ser garantida em falhas distribuídas. | Documentar semântica at-least-once, reconciliar estados e validar o resultado no serviço. |
| **Ausência de métricas e alertas em produção.** | Implantar monitoramento antes de uso real e manter health checks como validação inicial. |
| **Credenciais ou dados pessoais expostos em logs.** | Não registrar corpo, secrets ou identificadores sensíveis; limitar logs e usar variáveis de ambiente. |

## 12. Linha do Tempo

| Fase | Período | Status | Escopo / Entregáveis |
| :--- | :--- | :--- | :--- |
| **1. Descoberta e planejamento** | 23/09 a 06/10/2026 | Concluída | Requisitos, escopo e arquitetura inicial |
| **2. Desenvolvimento da plataforma** | 07/10 a 14/11/2026 | Concluída | API, web, mobile, banco, cache e notificações |
| **3. Arquitetura, resiliência e qualidade** | 15/11 a 20/11/2026 | Concluída | OpenAPI, Outbox, circuit breaker, logs, DTOs e documentação |
| **4. CI/CD e operação** | 18/11 a 21/11/2026 | Concluída | Workflows backend/mobile, deploy Compose e runbook |
| **5. Validação e apresentação** | 22/11 a 23/11/2026 | Em andamento | Validação final, testes, homologação e demonstração |


## 13. Custos (Estimativa de Exemplo)

| Categoria | Detalhamento | Valor Estimado |
| :--- | :--- | ---: |
| **Desenvolvimento** | 2 pessoas, 12 semanas, 10 h/semana, R$ 40,00/h | R$ 9.600,00 |
| **Infraestrutura** | Servidor de homologação com MySQL e Redis (3 meses) | R$ 180,00 |
| **Serviços externos** | Domínio; SMTP e Expo no plano gratuito | R$ 40,00 |
| **Manutenção** | 3 meses após a entrega (R$ 100,00/mês) | R$ 300,00 |
| **Total Estimado** | | **R$ 10.120,00** |