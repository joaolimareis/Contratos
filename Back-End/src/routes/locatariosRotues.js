import express from "express";
import {createLocatarios,
  getAllLocatarios,
  getLocatarioById,
  updateLocatarios,
  deleteLocatarios} from  "../controllers/locatariosControllers.js"
import validateLocatario from "../middlewares/locatariosValidador.js";

const router = express.Router();

router.post("/locatarios",validateLocatario,  createLocatarios)
router.get("/locatarios", getAllLocatarios)
router.get("/locatarios/:id", getLocatarioById)
router.put("/locatarios/:id",  updateLocatarios)
router.delete("/locatarios/:id", deleteLocatarios)

export default router