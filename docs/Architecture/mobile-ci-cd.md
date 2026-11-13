# CI do Mobile

## Objetivo e escopo

O workflow [`ci-cd-mobile.yml`](../../.github/workflows/ci-cd-mobile.yml)
valida que o projeto Expo Mobile instala suas dependências e consegue gerar o
export web estático. Ele não faz deploy, não publica um artefato e não gera
builds nativos Android ou iOS.

## Quando é executado

O workflow é acionado:

- em `push` para `main`, `develop`, `feat/**` ou `bugfix/**`, quando há
  alterações em `Mobile/**` ou no próprio workflow;
- em `pull_request` cujo branch de destino seja um desses branches e que
  contenha alterações nesses mesmos caminhos;
- manualmente por `workflow_dispatch`, para validar o branch selecionado.

As alterações em outros diretórios não acionam esse workflow automaticamente.
O workflow principal do backend continua tendo seus próprios gatilhos e
executa sua validação separadamente.

## Etapas

O job `validate-mobile` roda em `ubuntu-latest` e usa Node.js 24:

1. Faz checkout do repositório.
2. Configura cache npm associado a `Mobile/package-lock.json`.
3. Executa `npm ci` dentro de `Mobile`, instalando as dependências travadas no
   lockfile.
4. Executa `npx expo export --platform web`, que empacota a aplicação e
   renderiza suas rotas para a saída web estática `Mobile/dist`.

O diretório `dist` é saída gerada e ignorada pelo Git; o workflow não faz
upload dela como artefato.

## Testes e variáveis

O Mobile não possui atualmente script ou arquivos de testes automatizados. Por
isso, a etapa de export web funciona como verificação de instalação, bundle e
renderização estática, mas não substitui testes unitários ou de interface. Os
testes automatizados do backend são executados pelo workflow
[`ci-cd.yml`](../../.github/workflows/ci-cd.yml).

Este job não precisa de segredos do GitHub. `EXPO_PUBLIC_API_URL` não é definido
no workflow; o build segue o padrão do projeto para web, que usa caminho
relativo quando não há URL configurada. O deploy Compose serve o Mobile web e
encaminha as chamadas de API pelo Nginx.

O lint Expo e o type-check TypeScript não são etapas bloqueantes no momento,
pois reportam problemas existentes no Mobile. Devem ser adicionados ao workflow
depois que esses erros forem resolvidos.

## Relação com o deploy

O workflow Mobile não implanta a aplicação. O deploy continua sendo iniciado
manualmente no job `deploy` do workflow principal, após a validação e com
`deploy: true`. Esse job sincroniza o repositório e executa
`docker compose up --build -d --wait`, reconstruindo o container web do Mobile
junto dos demais serviços. Consulte [Entrega e operação](./delivery-and-operations.md)
para os requisitos do ambiente, rollback e runbook.
