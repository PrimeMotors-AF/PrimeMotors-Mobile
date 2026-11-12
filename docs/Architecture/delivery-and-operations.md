# Entrega e operação

## Estado observado do CI/CD

O backend oferece `npm test`, `npm run lint` e `npm run build`; os hooks Husky
executam testes em commit e push. O workflow
[`ci-cd.yml`](../../.github/workflows/ci-cd.yml) executa esses testes, valida o
OpenAPI e constrói a imagem do backend em pull requests e pushes para a branch
`main`. O job de deploy é manual, depende do sucesso da validação e do ambiente
protegido `production`; sincroniza apenas arquivos versionados (excluindo
certificados) e executa `docker compose up --build -d --wait`.

Para habilitar o deploy, configure no ambiente GitHub `production` as variáveis
`DEPLOY_HOST`, `DEPLOY_USER` e `DEPLOY_PATH` (caminho absoluto no servidor), e
os secrets `DEPLOY_SSH_PRIVATE_KEY` e `DEPLOY_KNOWN_HOSTS`. O host precisa ter
Docker com Compose v2 e acesso SSH; crie previamente nesse caminho
`PrimeMotors-docker/.env` e `PrimeMotors-backend/.env` com valores próprios e
válidos. Os arquivos `.env` não são transferidos pelo workflow. Configure as
regras de aprovação do environment `production` antes de usar em produção.
Nenhum servidor, segredo ou credencial de deploy é presumido ou incluído no
repositório.

## Fluxo de entrega

1. Em pull requests e pushes para `main`, instalar dependências do backend,
   gerar o cliente Prisma, executar testes, lint, build, validação OpenAPI e
   build da imagem Docker.
2. Para deploy, executar manualmente o workflow com `deploy: true`; a aprovação
   do environment `production` pode exigir revisão humana.
3. O host compila e atualiza os serviços Compose e aguarda os health checks.
   Verificar também leitura do catálogo e fluxos controlados após o deploy.
4. Executar migrations compatíveis antes de ativar código que dependa delas.
   Preferir mudanças expand/contract para permitir reversão da aplicação.

Comandos do job de validação, executados na pasta `PrimeMotors-backend`:

```sh
npm ci
npx prisma generate
npm test -- --runInBand
npm run lint
npm run build
```

O ambiente de CI deve fornecer as variáveis necessárias de forma segura, sem
apontar para dados de produção nos testes.

## Deploy e rollback

O workflow reconstrói os serviços no host pelo Compose; não publica imagens em
registry nem implementa rollback automático. Antes de um deploy, registrar o
commit e a versão do schema atuais; verificar readiness e smoke tests após a
atualização.

Se houver falha, retornar o código ao commit anterior e reconstruir os serviços
somente se o schema continuar compatível. Rollback de código não desfaz
migrations destrutivas: usar alterações compatíveis e plano separado de
restauração/roll-forward. Blue/green requer duas pilhas e roteamento que o
Compose atual não configura.

## Runbook curto: API indisponível

1. Confirmar incidente, horário, ambiente e impacto; consultar monitoramento e
   logs dos serviços. Não publicar tokens, dados pessoais ou segredos no ticket.
2. Verificar containers e estado:

   ```sh
   docker compose ps
   docker compose logs --tail=200 backend db redis mobile
   ```

3. Consultar `GET /health/ready` localmente. Se falhar, verificar primeiro
   MySQL e Redis (`health` nos containers, conectividade e espaço em disco);
   depois consultar o erro de inicialização e logs da API.
4. Se houver deploy recente, comparar versão da imagem e migrations. Reverter
   para a última imagem conhecida como saudável se o problema for da aplicação
   e o schema continuar compatível. Não remover volumes para tentar recuperar
   serviço.
5. Se o problema for MySQL, preservar volume e evidências; envolver responsável
   por banco e restaurar backup somente conforme procedimento aprovado. Se Redis
   falhar, considerar que leitura de carros pode usar MySQL, mas endpoints com
   rate limit podem retornar `503`; acompanhar cache e Outbox antes de reiniciar
   ou limpar dados.
6. Validar readiness, uma leitura de catálogo e fluxo de escrita controlado;
   verificar erros e atrasos do Outbox/Stream. Registrar causa, duração,
   impacto, ações e prevenção.
