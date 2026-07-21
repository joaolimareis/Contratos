import express from "express";

const router = express.Router();

router.post("/usuarios", createUsuarios);
router.get("/usuarios/:id", getAllUsuarios)
router.get("/usuarios/:id", getUsusariosById)
router.put("/usuarios/:id", updateUsuarios)
router.delete("/usuarios/:id", deleteUsuarios)


export default router