import express from "express"
import { getAllImovel, createImovel,updateImovel,getAllImovelById,deleteImovel } from "../controllers/imovelControllers.js";

const router = express.Router();

router.post("/imoveis",createImovel)
router.get("/imoveis",getAllImovel)
router.get("/imoveis/:id",getAllImovelById)
router.put("/imoveis/:id",updateImovel)
router.delete("/imoveis/:id",deleteImovel)

export default router