import { Router } from "express";

import File from "../models/File.js";
import User from "../models/User.js";
import handleUpload from "../middleware/uploadMiddleware.js";
import generateLinkDownload from "../helpers/generateLinkDownload.js";

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/files", handleUpload, async (req, res) => {
  const file = req.file;
  const { expireAt, isPublic } = req.body;
  let expireAtUpload = null;
  if (!file) {
    return res.status(400).json({ message: "Nenhum arquivo foi selecionado" });
  }

  if (typeof isPublic === "undefined") {
    return res.status(400).json({
      message: "Você precisa informar se o link será público ou privado",
    });
  }

  if (expireAt) {
    expireAtUpload = new Date(expireAt);

    if (isNaN(expireAtUpload.getTime())) {
      await fs.unlink(file.path);
      return res.status(400).json({ message: "Data de expiração inválida" });
    }

    if (expireAtUpload <= new Date()) {
      await fs.unlink(file.path);
      return res.status(400).json({
        message:
          "A data de expiração não pode ser menor ou igual a data de upload",
      });
    }
  }

  const userOn = await User.findOne({ _id: req.user.id });

  const newTotalStorageUser = userOn.storageUsed + file.size;

  if (newTotalStorageUser > userOn.storageLimit) {
    await fs.unlink(file.path);
    return res.status(400).json({
      message:
        "Esse upload excede o teu limite de armazenamento. Delete arquivos antigos para liberar espaço.",
    });
  }

  const { linkId, downloadUrl } = generateLinkDownload(req);

  const newFile = await File.create({
    userId: req.user.id,
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
    isPublic: isPublic,
    expireAt: expireAtUpload,
    shareLink: downloadUrl,
    linkId: linkId,
  });

  await User.findByIdAndUpdate(
    { _id: req.user.id },
    {
      $inc: { storageUsed: file.size },
    }
  );
  res.status(201).json({ message: `Arquivo enviado com sucesso`, newFile });
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

  console.log("Dados do user logado: ", req.user);

  if (!findLinkDownload.isPublic) {
    if (!req.user) {
      return res.status(401).json({
        message: "Login necessário para baixar este arquivo privado.",
      });
    }

    const findUserOn = await User.findOne({ _id: req.user.id });

    if (!findUserOn) {
      return res
        .status(404)
        .json({ message: "Usuário não autenticado, Faça login!" });
    }

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
    const userOn = await User.findOne({ _id: req.user.id });

    if (!userOn) {
      return res.status(400).json({
        message: "Você precisa estar autenticado para deletar esse arquivo",
      });
    }

    const findFile = await File.findById({ _id: id });

    if (!findFile) {
      return res
        .status(400)
        .json({ message: "Arquivo não encontrado, Tente novamente" });
    }

    if (findFile.userId.toString() != req.user.id) {
      return res
        .status(400)
        .json({ message: "Você não tem permissão de deletar esse arquivo" });
    }

    await findFile.deleteOne();

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

router.get("/files/:files", (req, res) => {
  res.status(200).json({ messag: "Listar arquivos do usuário logado" });
});

router.get("/files/:id/info", (req, res) => {
  res
    .status(200)
    .json({ messag: "Ver informações e logs de download do arquivo" });
});
export default router;
