import express from "express";
import { createLocador,
  getAllLocador,
  getLocadorById,
  updateLocador,
  deleteLocador} from  "../controllers/locadorControllers.js"


const router = express.Router();

router.post("/locador",  createLocador)
router.get("/locador", getAllLocador)
router.get("/locador/:id", getLocadorById)
router.put("/locador/:id",  updateLocador)
router.delete("/locador/:id", deleteLocador)

export default router