import express from "express";
import {createUsuarios,getAllUsuarios, getUsuariosById, updateUsuarios, deleteUsuarios} from "../controllers/usuariosControllers.js"
import validateUsuarios from "../middlewares/inputValidator.js";
const router = express.Router();


router.post("/usuarios",validateUsuarios, createUsuarios);
router.get("/usuarios", getAllUsuarios)
router.get("/usuarios/:id", getUsuariosById)
router.put("/usuarios/:id", validateUsuarios, updateUsuarios)
router.delete("/usuarios/:id", deleteUsuarios)


export default router