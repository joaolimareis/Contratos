import express from "express";

import {
  getAllImovelController,
  createImovelController,
  updateImovelController,
  getImovelByIdController,
  deleteImovelController
} from "../controllers/imovelControllers.js";

import validateImoveis from "../middlewares/imoveisValidador.js";


const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Imoveis
 *   description: Imoveis management API
 */


/**
 * @swagger
 * /api/imoveis:
 *   get:
 *     summary: Retrieve all imoveis
 *     tags: [Imoveis]
 *     responses:
 *       200:
 *         description: List of all imoveis
 */
router.get(
  "/imoveis",
  getAllImovelController
);


/**
 * @swagger
 * /api/imoveis:
 *   post:
 *     summary: Create a new imovel
 *     tags: [Imoveis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Imovel created successfully
 */
router.post(
  "/imoveis",
  validateImoveis,
  createImovelController
);


/**
 * @swagger
 * /api/imoveis/{id}:
 *   get:
 *     summary: Get a imovel by ID
 *     tags: [Imoveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Imovel data found
 *       404:
 *         description: Imovel not found
 */
router.get(
  "/imoveis/:id",
  getImovelByIdController
);


/**
 * @swagger
 * /api/imoveis/{id}:
 *   put:
 *     summary: Update a imovel by ID
 *     tags: [Imoveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Imovel updated successfully
 *       404:
 *         description: Imovel not found
 */
router.put(
  "/imoveis/:id",
  updateImovelController
);


/**
 * @swagger
 * /api/imoveis/{id}:
 *   delete:
 *     summary: Delete a imovel by ID
 *     tags: [Imoveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Imovel deleted successfully
 *       404:
 *         description: Imovel not found
 */
router.delete(
  "/imoveis/:id",
  deleteImovelController
);


export default router;