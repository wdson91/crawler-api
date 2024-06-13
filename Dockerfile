# Use uma imagem base do Node.js com a versão desejada
FROM node:alpine

# Crie o diretório de trabalho dentro do container
WORKDIR /app

# Copie os arquivos necessários (package.json e package-lock.json)
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante dos arquivos da aplicação para o diretório de trabalho no container
COPY . .

# Exponha a porta em que o Node.js está sendo executado
EXPOSE 3000

# Comando para iniciar a aplicação quando o container for executado
CMD ["node", "app.js"]
