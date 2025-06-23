import { Router } from "express";

import File from "../models/File.js";
import handleUpload from "../middleware/uploadMiddleware.js";
import generateLinkDownload from "../helpers/generateLinkDownload.js";
import { fileURLToPath } from "url";
import path from "path";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/files", handleUpload, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Nenhum arquivo foi selecionado" });
  }

  const expireAtUpload = new Date();
  expireAtUpload.setDate(expireAtUpload.getDate() + 1);

  const { linkId } = generateLinkDownload(req);

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

router.get("/files/:linkId", async (req, res) => {
  const { linkId } = req.params;

  if (!linkId) {
    return res
      .status(400)
      .json({ message: "Precisa passar um link válido para download" });
  }

  const findLinkDownload = await File.findOne({ linkId });

  if (!findLinkDownload) {
    return res.status(400).json({ message: "Link não encontrado" });
  }

  if (
    findLinkDownload.expireAt &&
    new Date() > new Date(findLinkDownload.expireAt)
  ) {
    return res.status(400).json({ message: "O link fornecido está expirado" });
  }

  const filePath = path.resolve(
    __dirname,
    "..",
    "uploads",
    findLinkDownload.filename
  );

  return res.download(filePath, findLinkDownload.originalName, async (err) => {
    if (err) {
      res.status(400).json({ messege: "Erro aoenviar o arquivo" });
      console.log("Erro ao enviar o arquivo", err);
    }

    await File.findByIdAndUpdate(findLinkDownload._id, {
      $inc: { downloadCount: 1 },
    });
  });
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
