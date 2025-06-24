import fs from "fs/promises";
import User from "../models/User.js";

export const chekStorageLimit = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.user.id });
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado" });
    }

    const newTotal = user.storageUsed + file.size;

    if (newTotal > user.storageLimit) {
      await fs.unlink(file.path);
      return res.status(400).json({
        message:
          "Upload excede seu limite de armazenamento. Apague arquivos antigos.",
      });
    }
    next();
  } catch (error) {
    console.log("Erro no middleware de storageLimit", err);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};
