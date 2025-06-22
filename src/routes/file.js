import { Router } from "express";
import upload from "../multer/configUpload.js";
import multer from "multer";

const router = Router();

router.post("/files", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code == "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "Arquivo muito grande. Máximo permitido: 5MB" });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Nenhum arquivo foi selecionado" });
    }
    res.status(201).json({
      message: "Arquivo enviado com sucesso",
      file: {
        orginalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      },
    });
  });
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
