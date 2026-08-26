import express from "express";

import login from "../controllers/loginControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);

router.get("/me", authMiddleware, (req, res) => {

     console.log("ROTA /ME FOI ACESSADA");
  console.log("USUARIO:", req.usuario);
  return res.status(200).json({
    usuario: {
      id: req.usuario.id,
      email: req.usuario.email,
    },
  });
});

export default router;