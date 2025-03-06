# Estágio de build
# Etapa 1: Construir a aplicação
FROM node:current-alpine3.20 AS builder

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json
COPY package*.json /usr/src/app

# Instalar as dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Construir a aplicação
RUN npm run build

# Etapa 2: Servir a aplicação com Nginx
FROM nginx:alpine

# Copia os arquivos de build da etapa anterior para o diretório de publicação do Nginx
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Exponha a porta 80 para acesso à aplicação
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]