import { Router } from "express";

import File from "../models/File.js";
import User from "../models/User.js";
import handleUpload from "../middleware/uploadMiddleware.js";
import generateLinkDownload from "../helpers/generateLinkDownload.js";
import { chekStorageLimit } from "../middleware/checkStorageLimit.js";

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import { validateExpireAt } from "../middleware/validateExpireAt.js";
import { checkUser } from "../middleware/checkUser.js";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post(
  "/files",
  handleUpload,
  validateExpireAt,
  chekStorageLimit,
  async (req, res) => {
    const file = req.file;
    const { isPublic } = req.body;
    let expireAtUpload = null;
    if (!file) {
      return res
        .status(400)
        .json({ message: "Nenhum arquivo foi selecionado" });
    }

    const isPublicValue = isPublic === "true";

    const { linkId, downloadUrl } = generateLinkDownload(req);

    const newFile = await File.create({
      userId: req.user.id,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      isPublic: isPublicValue,
      expireAt: req.expireAtUpload,
      shareLink: downloadUrl,
      linkId: linkId,
    });

    await User.findByIdAndUpdate(
      { _id: req.user.id },
      {
        $inc: { storageUsed: file.size },
      }
    );
    res
      .status(201)
      .json({ message: `Arquivo enviado com sucesso`, files: newFile });
  }
);

router.get("/files/:linkId", checkUser, async (req, res) => {
  const { linkId } = req.params;

  if (!linkId) {
    return res
      .status(400)
      .json({ message: "Precisa passar um link válido para download" });
  }

  const findLinkDownload = await File.findOne({ linkId });

  if (!findLinkDownload) {
    return res.status(404).json({ message: "Link não encontrado" });
  }

  if (
    findLinkDownload.expireAt != null &&
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

  if (!findLinkDownload.isPublic) {
    if (findLinkDownload.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Você não tem permissão para baixar este arquivo." });
    }
  }

  return res.download(filePath, findLinkDownload.originalName, async (err) => {
    if (err) {
      res.status(400).json({ messege: "Erro ao enviar o arquivo" });
      console.log("Erro ao enviar o arquivo", err);
    }

    await File.findByIdAndUpdate(findLinkDownload._id, {
      $inc: { downloadCount: 1 },
    });
  });
});

router.delete("/files/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Precisa passar um id válido" });
  }

  try {
    const findFile = await File.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!findFile) {
      return res
        .status(400)
        .json({ message: "Arquivo não encontrado ou sem permissão" });
    }

    const filePath = path.resolve(
      __dirname,
      "..",
      "uploads",
      findFile.filename
    );

    try {
      await fs.stat(filePath);
      await fs.unlink(filePath);
    } catch (err) {
      if (err.code != "ENOENT") {
        throw err;
      }
    }
    res.status(200).json({ message: "Arquivo deletado" });
  } catch (error) {
    res.status(500).json({ message: "Falha no servidor" });
    console.log(error);
  }
});

router.get("/files", async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Login necessário para listar arquivos." });
  }
  const findFile = await File.find({ userId: req.user.id });

  if (findFile.length == 0) {
    return res
      .status(200)
      .json({ message: "Você ainda não tem arquivos", files: [] });
  }
  res
    .status(200)
    .json({
      message: "Seus arquivos",
      total: findFile.length,
      files: findFile,
    });
});

router.get("/files/:id/info", (req, res) => {
  res
    .status(200)
    .json({ messag: "Ver informações e logs de download do arquivo" });
});
export default router;
