import express from "express";
import casasController from "../Controllers/casasControllers.js";
const router = express.Router();

router.get("/casas", casasController.getAllCasas);
router.post("/casas", casasController.createCasa);

export default router;