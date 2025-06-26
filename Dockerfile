#Imagem base
FROM node:18

#Diretorio de trabalho dentro do container
WORKDIR /app

#Copia os arquivos package.json e package-lock.json
COPY package*.json ./

#Instala dependências
RUN npm install

#Copia o restante do codigo
COPY . .

#Expõe a porta (usa a mesma do app, ex: 3000, 3001)
EXPOSE 3000

#Comando para iniciar a API
CMD [ "npm", "run", "dev" ]

