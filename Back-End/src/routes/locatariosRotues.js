import express from "express";

import {
  createLocatariosController,
  getAllLocatariosController,
  getLocatariosByIdController,
  updateLocatariosController,
  deleteLocatariosController
} from "../controllers/locatariosControllers.js";

import validateLocatario from "../middlewares/locatariosValidador.js";

const router = express.Router();



 
router.get(
  "/locatarios",
  getAllLocatariosController
);



router.post(
  "/locatarios",
  validateLocatario,
  createLocatariosController
);



router.get(
  "/locatarios/:id",
  getLocatariosByIdController
);



router.put(
  "/locatarios/:id",
  updateLocatariosController
);


router.delete(
  "/locatarios/:id",
  deleteLocatariosController
);


export default router;