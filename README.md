# API de Upload e Compartilhamento de Arquivos

## 💡 Ideia Geral

Esta API permite que usuários autenticados façam upload de arquivos, gerem links públicos ou privados para compartilhamento, definam expiração para os links, controlem o limite de armazenamento e acompanhem relatórios de downloads.

---

## 🚀 Funcionalidades Principais

- **Upload de Arquivos:** Usuários autenticados podem enviar arquivos para a plataforma.
- **Links Públicos e Privados:** Geração de links para download, podendo ser públicos (acesso livre) ou privados (requer autenticação).
- **Expiração de Links:** Possibilidade de definir uma data de expiração para o link de download.
- **Limite de Armazenamento:** Cada usuário possui um limite de armazenamento (padrão: 100 MB).
- **Relatórios de Download:** Visualização de informações e contagem de downloads por arquivo.
- **Deleção Automática:** Arquivos expirados são removidos automaticamente por um job agendado.

---

## 🗂️ Entidades

### User

```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "password": "String",
  "storageUsed": "Number (em bytes)",
  "storageLimit": "Number (padrão: 104857600 bytes ou 100 MB)"
}
```

### File

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "filename": "String",
  "originalName": "String",
  "size": "Number",
  "mimetype": "String",
  "uploadDate": "Date",
  "isPublic": "Boolean",
  "expiresAt": "Date (opcional)",
  "downloadCount": "Number",
  "shareLink": "String",
  "linkId": "String"
}
```

---

## 🔐 Autenticação

- **JWT** para autenticação de rotas protegidas.
- **bcrypt** para hash de senhas.

### Endpoints de Autenticação

- `POST /register` — Cadastro de usuário
- `POST /login` — Login do usuário

---

## 📦 Endpoints Principais

- `POST /files`  
  Upload de arquivo (requer autenticação)

- `GET /files/:linkId`  
  Download de arquivo (público ou protegido)

- `DELETE /files/:id`  
  Deletar arquivo do usuário autenticado

- `GET /files`  
  Listar arquivos do usuário logado

- `GET /files/:id/info`  
  Ver informações e logs de download do arquivo

---

## ⚙️ Funcionalidades Avançadas

- **Links privados** requerem autenticação JWT para download.
- **Arquivos com `expiresAt`** são apagados automaticamente por um cron job.
- **Contador de downloads** por arquivo.
- **Validação de armazenamento:** O upload só é permitido se o usuário não exceder seu limite.
- **Geração de link público** usando base64url.

---

## 🛠️ Stack Utilizada

- **Node.js** + **Express** — Backend e API REST
- **MongoDB** + **Mongoose** — Banco de dados
- **Multer** — Upload de arquivos
- **JWT** + **bcrypt** — Autenticação e segurança
- **Node-cron** — Agendamento de tarefas (deleção de arquivos expirados)
- **File System** — Os arquivos são armazenados localmente no servidor.
- **Docker + Docker Compose** — Containerização da aplicação e orquestração de ambiente (API + dependências)

---

## 📚 Documentação

Em breve: [Acesse a documentação completa aqui](URL_DA_DOCUMENTACAO)

## 📋 Como rodar o projeto

1. **Clone o repositório**
   ```bash
   git clone <https://github.com/juelsonjunior/api-file-share.git>
   cd api-file-share
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   - Copie o arquivo `.env.example` para `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edite o arquivo `.env` conforme necessário:
     - `PORT`: Porta onde o servidor irá rodar (ex: 3000)
     - `DB_HOST`: String de conexão do MongoDB (ex: mongodb://localhost:27017/nome-do-banco)
     - `JWT_SECRET`: Chave secreta para geração dos tokens JWT

4. **Inicie o servidor**
   ```bash
   npm start
   ```

---

## 📝 Observações

- Certifique-se de ter o MongoDB rodando localmente ou utilize um serviço em nuvem.
- O limite de armazenamento pode ser ajustado por usuário.
- Para produção, recomenda-se utilizar um serviço de armazenamento em nuvem para os arquivos.
