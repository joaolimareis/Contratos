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


/**
 * @swagger
 * /api/locatarios/{id}:
 *   delete:
 *     summary: Delete a locatario by ID
 *     tags: [Locatarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The locatario ID
 *     responses:
 *       200:
 *         description: Locatario deleted successfully
 *       404:
 *         description: Locatario not found
 */
router.delete(
  "/locatarios/:id",
  deleteLocatariosController
);


export default router;