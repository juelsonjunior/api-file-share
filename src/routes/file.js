import { Router } from "express";

const router = Router();

router.post("/files/:upload", (req, res) => {
  res.status(201).json({ messag: "Upload de arquivo (requer autenticação)" });
});

router.get("/files/:linkId", (req, res) => {
  res
    .status(200)
    .json({ messag: "Download de arquivo (link público ou protegido)" });
});

router.delete("/files/:id", (req, res) => {
  res.status(200).json({ messag: "Deletar arquivo do usuário" });
});

router.get("/files/:files", (req, res) => {
  res.status(200).json({ messag: "Listar arquivos do usuário logado" });
});

router.get("/files/:id/info", (req, res) => {
  res
    .status(200)
    .json({ messag: "Ver informações e logs de download do arquivo" });
});
export default router;
