# Infra
# PrimeMotors - Docker

## Executar banco, API e Mobile Web

O serviço `mobile` exporta o projeto Expo para web durante o build e serve os
arquivos estáticos com o Nginx configurado em `Mobile/nginx.conf`. Ele encaminha
as rotas da API para o serviço `backend` pela rede interna do Docker.
O backend também mantém uma conexão com Redis. Dentro do Docker, use
`redis://redis:6379`; no host local, use `redis://127.0.0.1:6379`. O Compose
publica Redis somente no loopback do host e mantém os dados no volume
persistente `redis_data`. Leituras de carros usam cache-aside com TTL padrão de
300 segundos (`CAR_CACHE_TTL_SECONDS`); a invalidação incrementa a versão das
chaves para expirar logicamente todas as páginas e detalhes sem depender de
varreduras globais no Redis.

1. Crie `PrimeMotors-docker/.env` a partir de `.env.example` e informe valores
   próprios para as variáveis do MySQL. `MYSQL_USER` deve ser um usuário comum
   (não use `root`), e `MYSQL_USER`/`MYSQL_PASSWORD` devem corresponder às
   credenciais usadas em `DATABASE_URL`. A senha de root do banco é configurada
   separadamente por `MYSQL_ROOT_PASSWORD`. Configure também
   `SHADOW_DATABASE_URL` para um banco separado (`PrimeMotors_shadow`) acessível
   pelo usuário de aplicação. Codifique caracteres especiais da senha como
   `%40` para `@`, por exemplo.
2. Crie `PrimeMotors-backend/.env` a partir do respectivo `.env.example` para as
   demais configurações do backend. Para executar o seed pelo terminal do host,
   configure `DATABASE_URL` nesse arquivo com `localhost`, o usuário/senha de
   aplicação e o nome do banco. Para o backend dentro do Docker, configure
   `DATABASE_URL` em `PrimeMotors-docker/.env` com o hostname `db`; o Compose
   fornece esse valor ao container.
3. A partir desta pasta, execute:

   ```sh
   docker compose up --build
   ```

O Mobile Web ficará disponível em `http://localhost`. `EXPO_PUBLIC_API_URL`
fica vazio por padrão para que o bundle use caminhos relativos e as chamadas
sejam encaminhadas pelo Nginx ao backend. Essa variável é incorporada durante o
build do Expo; alterá-la exige reconstruir o serviço `mobile`.
Durante o desenvolvimento pelo Expo fora do Docker, o backend também fica
disponível em `http://localhost:3000`; configure
`Mobile/.env` com `EXPO_PUBLIC_API_URL=http://localhost:3000` e reinicie o
servidor Expo para carregar a variável.
Para executar o backend diretamente no host, configure
`PrimeMotors-backend/.env` com `REDIS_URL=redis://127.0.0.1:6379`.

O health check do banco valida uma consulta usando o usuário de aplicação, e o
da API confirma que ela consegue consultar o banco e o Redis. Assim, a página
web não é marcada como pronta só porque o processo HTTP respondeu. Logs de
Nginx vão para stdout/stderr e os logs dos containers têm rotação configurada.

Para propostas criadas, o backend grava a proposta e seu evento na tabela
`ProposalOutbox` dentro da mesma transação MySQL. Um dispatcher publica eventos
pendentes no Redis Stream `email.confirmations`, com retry exponencial e lease
para evitar que duas instâncias processem a mesma linha ao mesmo tempo. O campo
`event` contém somente `eventId`, `type`, `occurredAt` e `proposalId`; nome,
e-mail, valor ofertado e outros dados pessoais não são copiados para Redis. O
`proposalId` ainda é um identificador rastreável e deve ser tratado como dado
pseudonimizado, não como dado anônimo. O futuro microserviço Python deve obter
os dados necessários por uma interface interna autenticada, sem recolocá-los no
evento, e consumir o stream com um consumer group, confirmando cada mensagem
(`XACK`) somente depois de processá-la e usando `eventId` para tornar o
processamento idempotente. O Stream mantém no máximo
aproximadamente 10.000 eventos e remove eventos com mais de 30 dias; eventos
publicados no outbox são removidos do MySQL após 30 dias, enquanto eventos que
ainda não chegaram ao Redis permanecem pendentes para retry. Portanto, o
consumidor futuro deve estar operacional dentro dessa janela, e o limite deve
ser revisto de acordo com o volume real antes de produção. Quando uma rota para
criar/editar/remover carros for adicionada, ela deve chamar
`invalidateCarCache()` depois que a alteração no MySQL for confirmada.

> As variáveis `MYSQL_*` inicializam contas e bancos apenas quando o volume
> `mysql_data` é criado pela primeira vez. Alterar o `.env` não troca credenciais
> em um volume já existente. Atualize a conta no MySQL com credenciais
> administrativas; não remova o volume para corrigir senha se precisar manter
> os dados.

Antes de preencher o banco, execute `npx prisma db seed` na pasta
`PrimeMotors-backend`. O seed apaga dados de várias tabelas antes de recriá-los;
confirme que está conectado ao banco correto e mantenha backup se houver dados
que devam ser preservados.

### Prisma Migrate

O usuário de aplicação precisa de permissões no banco principal e no banco de
shadow usado por `prisma migrate dev`. Crie o banco de shadow e conceda acesso
ao usuário uma vez, conectando-se ao MySQL como root:

```sql
CREATE DATABASE IF NOT EXISTS PrimeMotors_shadow;
GRANT ALL PRIVILEGES ON PrimeMotors_shadow.* TO 'primemotors_app'@'%';
```

Se `MYSQL_USER` tiver outro valor, substitua `primemotors_app` pelo usuário
configurado. O banco de shadow deve ser exclusivo para migrations; o Prisma
limpa e recria objetos nele durante `migrate dev`. Após configurar
`SHADOW_DATABASE_URL`, reconstrua o backend para incluir a configuração Prisma
e execute a migration:

```sh
docker compose up -d --build backend
docker compose exec backend npx prisma migrate dev
```

Este container publica a versão web do Expo, não os binários Android/iOS. Os
aplicativos nativos continuam sendo executados em dispositivos/emuladores e
precisam de uma URL de API acessível por eles.
