import fs from "fs/promises";
import path from "path";
import cron from "node-cron";
import { fileURLToPath } from "url";

import File from "../models/File.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cron.schedule("0 0 ***", async () => {
  try {
    const dateNow = new Date();
    const expiredFiles = await File.find({
      expireAt: { $ne: null, $lte: dateNow },
    });

    for (const file of expiredFiles) {
      const filePath = path.resolve(__dirname, "..", "uploads", file.filename);

      try {
        await fs.unlink(filePath);
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.error("Erro ao deletar arquivo físico:", err);
        }
      }

      await File.findByIdAndDelete({ _id: file._id });
    }

    console.log(`[CRON] Arquivos expirados removidos: ${expiredFiles.length}`);
  } catch (err) {
    console.log("Erro no cron de deleteExpiredFiles:", err);
  }
});
