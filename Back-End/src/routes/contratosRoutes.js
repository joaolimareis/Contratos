import express from "express";
import {
  createContrato,
  getAllContratos,
  getContratoById,
  updateContrato,
  deleteContrato
} from "../controllers/contratosControllers.js";
import validateContratos from "../middlewares/contratosValidador.js"
const router = express.Router();

router.post("/contratos",validateContratos, createContrato);
router.get("/contratos", getAllContratos);
router.get("/contratos/:id", getContratoById);
router.put("/contratos/:id", updateContrato);
router.delete("/contratos/:id", deleteContrato);

export default router;