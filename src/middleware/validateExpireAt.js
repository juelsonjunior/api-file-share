import fs from "fs/promises";

export const validateExpireAt = async (req, res, next) => {
  try {
    const { expireAt } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado" });
    }

    if (expireAt) {
      const expireAtUpload = new Date(expireAt);

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
      req.expireAtUpload = expireAtUpload;
    }
    next();
  } catch (err) {
    console.log("Erro no middleware de validteExpire", err);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};
