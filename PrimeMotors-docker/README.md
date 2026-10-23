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
   próprios para as variáveis do MySQL. `MYSQL_USER` e `MYSQL_PASSWORD` devem
   corresponder ao usuário e à senha usados em `DATABASE_URL`.
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

O Compose aguarda os health checks do banco, Redis e API antes de iniciar os
serviços dependentes. Logs de Nginx vão para stdout/stderr e os logs dos
containers têm rotação configurada.

Este container publica a versão web do Expo, não os binários Android/iOS. Os
aplicativos nativos continuam sendo executados em dispositivos/emuladores e
precisam de uma URL de API acessível por eles.
