import util from "util";
import upload from "../multer/configUpload.js";

const uploadMidleware = util.promisify(upload.single("file"));

export default async function handleUpload(req, res, next) {
  try {
    await uploadMidleware(req, res);
    next();
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "Arquivo muito grande. Máximo permitido: 5MB" });
    }
    return res.status(400).json({ message: err.message });
  }
}
