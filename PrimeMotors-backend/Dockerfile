FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Prisma loads its config during generate, so use a build-only URL without runtime credentials.
RUN DATABASE_URL="mysql://build:build@localhost:3306/build" npx prisma generate
RUN npm run build
RUN chown -R node:node /app/node_modules

EXPOSE 3000

USER node

CMD ["npm", "run", "start"]