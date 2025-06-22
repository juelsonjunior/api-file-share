import express from "express";
import dotenv from "dotenv";
import Routes from "./routes/index.js";
import connectBd from "./database/bd.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(Routes);

connectBd
  .then(() => {
    app.listen(port, () =>
      console.log(`Servidor rodando na porta http://localhost:${port}`)
    );
  })
  .catch((err) => {
    console.log("Falha ao conectar com o banco de dados", err);
  });
