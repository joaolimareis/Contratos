import express from "express";
import {
  createRecebimento,
  getAllRecebimentos,
  getRecebimentoById,
  updateRecebimento,
  deleteRecebimento
} from "../controllers/recebimentosControllers.js";

const router = express.Router();

router.post("/recebimentos", createRecebimento);
router.get("/recebimentos", getAllRecebimentos);
router.get("/recebimentos/:id", getRecebimentoById);
router.put("/recebimentos/:id", updateRecebimento);
router.delete("/recebimentos/:id", deleteRecebimento);

export default router;