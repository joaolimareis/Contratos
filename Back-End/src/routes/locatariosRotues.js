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


/**
 * @swagger
 * tags:
 *   name: Locatarios
 *   description: Locatarios management API
 */


/**
 * @swagger
 * /api/locatarios:
 *   get:
 *     summary: Retrieve all locatarios
 *     tags: [Locatarios]
 *     responses:
 *       200:
 *         description: List of all locatarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get(
  "/locatarios",
  getAllLocatariosController
);


/**
 * @swagger
 * /api/locatarios:
 *   post:
 *     summary: Create a new locatario
 *     tags: [Locatarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Locatario created successfully
 */
router.post(
  "/locatarios",
  validateLocatario,
  createLocatariosController
);


/**
 * @swagger
 * /api/locatarios/{id}:
 *   get:
 *     summary: Get a locatario by ID
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
 *         description: Locatario data found
 *       404:
 *         description: Locatario not found
 */
router.get(
  "/locatarios/:id",
  getLocatariosByIdController
);


/**
 * @swagger
 * /api/locatarios/{id}:
 *   put:
 *     summary: Update a locatario by ID
 *     tags: [Locatarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The locatario ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Locatario updated successfully
 *       404:
 *         description: Locatario not found
 */
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