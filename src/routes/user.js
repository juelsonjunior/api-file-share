import { Router } from "express";
import dotenv from "dotenv";

import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const router = Router();
const JWTSECRET = process.env.JWT_SECRET;

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Precisa preencher todos os campos" });
  }

  const findUser = await User.findOne({ email });

  if (!findUser) {
    return res
      .status(400)
      .json({ message: "Usuario não encontado. Verifica seus dados! " });
  }
  const passwordIsMatch = await bcrypt.compare(password, findUser.password);

  if (!passwordIsMatch) {
    return res
      .status(400)
      .json({ message: "Senha incorreta, Tente novamente!" });
  }

  const token = jwt.sign(
    { id: findUser._id, name: findUser.name },
    JWTSECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json(token);
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Precisa preencher todos os campos" });
  }

  const userDuplicated = await User.findOne({ email });

  if (userDuplicated) {
    return res
      .status(400)
      .json({ message: "Esse email já esta em uso. Tente outro!" });
  }

  const passwordHash = await bcrypt.hash(password, 8);
  const newUser = await User.create({ name, email, password: passwordHash });

  if (!newUser) {
    return res
      .status(400)
      .json({ messag: "Houve um problema ao cadastrar o usuario" });
  }

  res.status(201).json({ message: "Usuario cadastrado com sucesso" });
});

export default router;
