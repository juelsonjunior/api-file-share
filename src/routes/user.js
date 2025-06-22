import { Router } from "express";

const router = Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  res.status(200).json({ message: "oken gerado com sucesso" });
});

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  res.status(201).json({ message: "Usuario criado com sucesso" });
});

export default router;
