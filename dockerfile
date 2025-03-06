# Estágio de build
# Etapa 1: Construir a aplicação
FROM node:current-alpine3.20 AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json /app

# Instalar as dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Construir a aplicação
RUN npm run build

# Etapa 2: Servir a aplicação com Nginx
FROM nginx:alpine

# Remove o arquivo de configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia os arquivos de build da etapa anterior para o diretório de publicação do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponha a porta 80 para acesso à aplicação
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]