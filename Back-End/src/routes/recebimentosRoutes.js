import express from "express";

import {
  createRecebimentoController,
  getAllRecebimentosController,
  getRecebimentoByIdController,
  updateRecebimentoController,
  deleteRecebimentoController,
  gerarReciboController
} from "../controllers/recebimentosControllers.js";

import validateRecebimentos from "../middlewares/recebimentoValidador.js";

import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { uploadComprovanteController } from "../controllers/recebimentosControllers.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/comprovantes"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `comprovante-${req.params.id}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos PDF, JPG, PNG ou WEBP são permitidos."));
    }
  },
});
const router = express.Router();
router.post(
  "/recebimentos/:id/comprovante",
  upload.single("comprovante"),
  uploadComprovanteController
);

/**
 * @swagger
 * tags:  
 *  name: Recebimentos
 * description: Recebimentos management API
 */
/**
/**
 * @swagger
 * /api/recebimentos:
 *   get:
 *     summary: Retrieve all recebimentos
 *     tags: [Recebimentos]
 *     responses:
 *       200:
 *         description: List of all recebimentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get(
  "/recebimentos",
  getAllRecebimentosController
);


router.post(
  "/recebimentos",
  validateRecebimentos,
  createRecebimentoController
);

/**
 * @swagger
 * /api/recebimentos/{id}:
 *   get:
 *     summary: Get a recebimento by ID
 *     tags: [Recebimentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The recebimento ID
 *     responses:
 *       200:
 *         description: Recebimento data found
 *       404:
 *         description: Recebimento not found
 */
router.get(
  "/recebimentos/:id",
  getRecebimentoByIdController
);
router.get(
  "/recebimentos/:id/recibo",
  gerarReciboController
);

router.put(
  "/recebimentos/:id",
  updateRecebimentoController
);


router.delete(
  "/recebimentos/:id",
  deleteRecebimentoController
);


export default router;