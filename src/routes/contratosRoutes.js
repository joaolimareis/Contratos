import express from "express";
import {
  createContrato,
  getAllContratos,
  getContratoById,
  updateContrato,
  deleteContrato
} from "../controllers/contratosControllers.js";

const router = express.Router();

router.post("/contratos", createContrato);
router.get("/contratos", getAllContratos);
router.get("/contratos/:id", getContratoById);
router.put("/contratos/:id", updateContrato);
router.delete("/contratos/:id", deleteContrato);

export default router;