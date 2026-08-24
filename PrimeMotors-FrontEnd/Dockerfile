# Estágio 1: Build (Mantém exatamente igual)
FROM node:lts AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Produção
FROM nginx:alpine

# 👇 A LINHA NOVA ENTRA BEM AQUI:
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos gerados no Estágio 1 para a pasta pública do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe as portas internas do Nginx
EXPOSE 80 443

# Comando que mantém o Nginx rodando em primeiro plano
CMD ["nginx", "-g", "daemon off;"]

