# Infra
# PrimeMotors - Docker

## Executar banco, API e Mobile Web

O serviço `mobile` exporta o projeto Expo para web durante o build e serve os
arquivos estáticos com o Nginx configurado em `Mobile/nginx.conf`. Ele encaminha
as rotas da API para o serviço `backend` pela rede interna do Docker.
O Compose também provisiona Redis com volume persistente; ele fica acessível
somente pela rede Docker em `redis:6379`. A aplicação ainda precisa integrar
esse serviço para cumprir cache e publicação/consumo de eventos.

1. Crie `PrimeMotors-docker/.env` a partir de `.env.example` e informe valores
   próprios para as variáveis do MySQL. `MYSQL_USER` deve ser um usuário comum
   (não use `root`), e `MYSQL_USER`/`MYSQL_PASSWORD` devem corresponder às
   credenciais usadas em `DATABASE_URL`. A senha de root do banco é configurada
   separadamente por `MYSQL_ROOT_PASSWORD`. Configure também
   `SHADOW_DATABASE_URL` para um banco separado (`PrimeMotors_shadow`) acessível
   pelo usuário de aplicação. Codifique caracteres especiais da senha como
   `%40` para `@`, por exemplo.
2. Crie `PrimeMotors-backend/.env` a partir do respectivo `.env.example` para as
   demais configurações do backend. Configure `DATABASE_URL` no `.env desta
   pasta para apontar ao hostname `db` dentro da rede Docker, não a `localhost`;
   esse valor será aplicado ao backend pelo Compose.
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

O Compose aguarda os health checks do banco, Redis e API antes de iniciar os
serviços dependentes. Logs de Nginx vão para stdout/stderr e os logs dos
containers têm rotação configurada.

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
