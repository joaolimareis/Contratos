import express from "express";
import { getAllCasas, getCasaById, createCasa, updateCasa , deleteCasa} from "../Controllers/casasControllers.js";

const router = express.Router();

router.get("/casas", getAllCasas);
router.get("/casas/:id", getCasaById);
router.post("/casas", createCasa);
router.put("/casas/:id", updateCasa);
router.delete("/casas/:id", deleteCasa); // Uncomment this line if you implement the deleteCasa function in the controller
// router.delete('/casas/:id', deleteCasa);

export default router;