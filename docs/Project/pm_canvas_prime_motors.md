# PM Canvas: Prime Motors - Plataforma Automotiva Premium

> **Descrição:** Consulta de veículos, propostas e test drives em web, mobile e API.
>
> **Versão:** 1.0
>
> **Atualizado em:** 18/11/2026
>
> **Autores:** Fernando Consolin Rosa, Aitom Henrique Donatoni
>
> **Período do Módulo:** 23/09/2026 a 23/11/2026
>
> **Repositório:** [github.com/PrimeMotors-AF/PrimeMotors-Mobile](https://github.com/PrimeMotors-AF/PrimeMotors-Mobile)

## 1. Justificativa

Centralizar a consulta de veículos premium e o relacionamento do cliente com a loja em um único ecossistema, reunindo favoritos, garagem virtual, propostas e agendamento de test drives. Hoje essas informações ficam dispersas; a plataforma encurta o caminho entre a busca técnica e o fechamento da proposta.

## 2. Objetivo SMART

Até **23/11/2026**, entregar a **versão 1.0** da plataforma em ambiente de homologação, com demonstração na apresentação final, contemplando os fluxos de cadastro e login, catálogo, favoritos, propostas, test drive e gestão administrativa de propostas validados por:

* **Qualidade:** 90% ou mais dos casos de teste dos fluxos principais aprovados.
* **Consistência:** Paridade de recursos entre web e mobile.
* **Performance:** E-mail de proposta entregue em até 1 minuto após o evento.

## 3. Benefícios Esperados

* Fluxos de interesse e negociação de veículos mais acessíveis, na web e no celular.
* Notificações de propostas automatizadas por e-mail.
* Acompanhamento operacional facilitado: administradores alteram o status das propostas em tempo real pelo app.
* Permissões claras entre cliente e administrador (RBAC).

## 4. Produto (Stack Tecnológica)

* **App Mobile:** React Native e Expo (Expo Router, NativeWind)
* **Frontend Web:** React e TypeScript
* **API:** Node.js e Express, com JWT
* **Banco de Dados:** MySQL com Prisma
* **Cache & Mensageria:** Redis (cache, rate limit e eventos)
* **E-mail:** Serviço separado, via SMTP

## 5. Requisitos Principais

* Cadastro e autenticação.
* Consulta de veículos com filtros, detalhes e especificações.
* Favoritos e garagem virtual.
* Envio e gestão de propostas, inclusive pelo perfil administrador.
* Agendamento de test drives.
* Processamento e envio de notificações por e-mail.

## 6. Stakeholders

* Clientes
* Equipe comercial e administrativa
* Produto
* Desenvolvimento
* Operações e infraestrutura
* Provedor SMTP
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

* MySQL é a fonte de dados transacionais.
* Redis e SMTP são dependências externas.
* Credenciais são fornecidas por configuração segura do ambiente, nunca versionadas no repositório.

## 9. Entregas

* App mobile: autenticação, explorar, detalhes, favoritos, garagem, perfil, test drive e gestão de propostas.
* Frontend web com os mesmos fluxos.
* API REST com controle de acesso por função (RBAC).
* Persistência em MySQL com Prisma.
* Integração assíncrona de notificações por e-mail.
* Configuração de implantação (Docker e GitHub Actions).
* Testes e documentação operacional.

## 10. Restrições

* **Prazo:** 23/11/2026
* **Ambientes:** Desenvolvimento (Docker local) e homologação; produção apenas em demonstração.
* **Infraestrutura:** Compatibilidade com os serviços e a infraestrutura existentes.
* **Capacidade:** Equipe de duas pessoas em tempo parcial.

## 11. Riscos e Mitigação

| Risco | Resposta / Plano de Ação |
| :--- | :--- |
| **Indisponibilidade do Redis** atrasar a publicação de notificações. | Reprocessar os eventos pendentes assim que o serviço for restabelecido. |
| **Falhas de SMTP** atrasarem a entrega de e-mails. | Implementar mecanismo de novas tentativas de envio (*retries*). |
| **Mudanças de schema** exigirem implantação coordenada. | Utilizar *migrations* versionadas. |
| **Escopo em andamento** com prazo curto para duas pessoas. | Priorizar estritamente os fluxos principais (MVP). |

## 12. Linha do Tempo

| Fase | Período | Status | Escopo / Entregáveis |
| :--- | :--- | :--- | :--- |
| **1. Descoberta e planejamento** | 23/09 a 06/10/2026 | Concluída | Requisitos, escopo e arquitetura |
| **2. Desenvolvimento** | 07/10 a 30/11/2026 | Em andamento | API, web, mobile e notificações |
| **3. Testes e documentação** | 01/12 a 10/11/2026 | Próxima | Validação dos fluxos e documentação operacional |
| **4. Implantação e apresentação** | 11/12 a 23/11/2026* | Próxima | Homologação e demonstração final |


## 13. Custos (Estimativa de Exemplo)

| Categoria | Detalhamento | Valor Estimado |
| :--- | :--- | ---: |
| **Desenvolvimento** | 2 pessoas, 12 semanas, 10 h/semana, R$ 40,00/h | R$ 9.600,00 |
| **Infraestrutura** | Servidor de homologação com MySQL e Redis (3 meses) | R$ 180,00 |
| **Serviços externos** | Domínio; SMTP e Expo no plano gratuito | R$ 40,00 |
| **Manutenção** | 3 meses após a entrega (R$ 100,00/mês) | R$ 300,00 |
| **Total Estimado** | | **R$ 10.120,00** |