import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWTSECRET = process.env.JWT_SECRET;

export const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Você não tem acesso a essa area" });
    }

    const partsToken = token.split(" ");
    if (partsToken.length !== 2 || partsToken[0] !== "Bearer") {
      return res.status(400).json({ message: "Token mal formatado" });
    }

    const cleanToken = partsToken[1];
    const payload = jwt.verify(cleanToken, JWTSECRET);

    req.user = payload;
    next();
  } catch (error) {
    res.status(500).json({ message: "Falha no servidor" });
    console.log(error);
  }
};
