import express from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import {
  createContratoController,
  getAllContratosController,
  getContratoByIdController,
  updateContratoController,
  deleteContratoController,
  uploadContratoPdfController,
  removeContratoPdfController
} from "../controllers/contratosControllers.js";

import validateContratos from "../middlewares/contratosValidador.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "..", "uploads", "contratos");

// Cria a pasta se não existir
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `contrato-${req.params.id}-${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Apenas arquivos PDF são permitidos."));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Contratos
 *   description: Contratos management API
 */

router.post(
  "/contratos/:id/upload",
  upload.single("arquivo"),
  uploadContratoPdfController
);
router.delete(
  "/contratos/:id/upload",
  removeContratoPdfController
);
/**
 * @swagger
 * /api/contratos:
 *   get:
 *     summary: Retrieve all contratos
 *     tags: [Contratos]
 *     responses:
 *       200:
 *         description: List of all contratos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

router.get(
  "/contratos",
  getAllContratosController
);
/**
 * @swagger
 * /api/contratos:
 *   post:
 *     summary: Create a new contrato
 *     tags: [Contratos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locatario_id
 *               - imovel_id
 *               - data_inicio
 *               - valor
 *             properties:
 *               locatario_id:
 *                 type: integer
 *                 example: 1
 *               imovel_id:
 *                 type: integer
 *                 example: 1
 *               data_inicio:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-01"
 *               valor:
 *                 type: number
 *                 format: float
 *                 example: 1000.00
 *     responses:
 *       201:
 *         description: Contrato created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/contratos",
  validateContratos,
  createContratoController
);
/**
 * @swagger
 * /api/contratos/{id}:
 *   get:
 *     summary: Get a contrato by ID
 *     tags: [Contratos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The contrato ID
 *     responses:
 *       200:
 *         description: Contrato data found
 *       404:
 *         description: Contrato not found
 */

router.get(
  "/contratos/:id",
  getContratoByIdController
);
/**
 * @swagger
 * /api/contratos/{id}:
 *   put:
 *     summary: Update a contrato by ID
 *     tags: [Contratos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The contrato ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Contrato updated successfully
 */

router.put(
  "/contratos/:id",
  updateContratoController
);

/**
 * @swagger
 * /api/contratos/{id}:
 *   delete:
 *     summary: Delete a contrato by ID
 *     tags: [Contratos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The contrato ID
 *     responses:
 *       200:
 *         description: Contrato deleted successfully
 */
router.delete(
  "/contratos/:id",
  deleteContratoController
);


export default router;