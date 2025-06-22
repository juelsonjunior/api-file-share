import { Router } from "express";

import File from "../models/File.js";
import handleUpload from "../middleware/uploadMiddleware.js";
import generateLinkDownload from "../helpers/generateLinkDownload.js";

const router = Router();

router.post("/files", handleUpload, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Nenhum arquivo foi selecionado" });
  }

  const expireAtUpload = new Date();
  expireAtUpload.setDate(expireAtUpload.getDate() + 1);

  const linkId = generateLinkDownload(req);

  await File.create({
    userId: "Teste",
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimeType: req.file.mimetype,
    expireAt: expireAtUpload,
    linkId: linkId,
  });
  res
    .status(201)
    .json({ message: `Arquivo ${req.file.originalname} enviado com sucesso` });
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
