FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

USER node

CMD ["npm", "run", "start"]