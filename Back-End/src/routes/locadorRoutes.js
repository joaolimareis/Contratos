import express from "express";
import { createLocador,
  getAllLocador,
  getLocadorById,
  updateLocador,
  deleteLocador} from  "../controllers/locadorControllers.js"
import validatelocador from "../middlewares/locadorValidador.js";
const router = express.Router();

router.post("/locador",  validatelocador,createLocador)
router.get("/locador", getAllLocador)
router.get("/locador/:id", getLocadorById)
router.put("/locador/:id",  updateLocador)
router.delete("/locador/:id", deleteLocador)

export default router