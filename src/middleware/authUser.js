import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWTSECRET = process.env.JWT_SECRET;

export const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (token) {
      return res.status(400).json({ message: "Você não tem acesso a essa area" });
    }

    const cleanToken = token.split(" ")[1];
    const payload = jwt.verify(cleanToken, JWTSECRET);

    req.user = payload;
    next();
  } catch (error) {
    res.status(500).json({ message: "Falha no servidor" });
    console.log(error);
  }
};
