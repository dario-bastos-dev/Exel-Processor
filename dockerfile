# Etapa 1: Construir a aplicação
FROM node:current-alpine3.20 AS builder

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm ci

# Copiar o restante do código
COPY . .

# Construir a aplicação
RUN npm run build

# Etapa 2: Servir a aplicação com Nginx
FROM nginx:alpine AS runner

# Remove o arquivo de configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia o arquivo de configuração personalizado do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos de build da etapa anterior para o diretório de publicação do Nginx
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Exponha a porta 80 para acesso à aplicação
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]