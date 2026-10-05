import express from "express";

import {
  createRecebimentoController,
  getAllRecebimentosController,
  getRecebimentoByIdController,
  updateRecebimentoController,
  deleteRecebimentoController,
  gerarReciboController,
  uploadComprovanteController,
  getComprovanteUrlController,
  removeComprovanteController
} from "../controllers/recebimentosControllers.js";
import validateRecebimentos from "../middlewares/recebimentoValidador.js";

import multer from "multer";
import path from "node:path";

const upload = multer({
  storage: multer.memoryStorage(),
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


router.get(
  "/recebimentos/:id/comprovante",
  getComprovanteUrlController
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
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const msg =
      err.code === "LIMIT_FILE_SIZE"
        ? "O arquivo deve ter no máximo 5 MB."
        : err.message;
    return res.status(400).json({ message: msg });
  }
  if (err?.message?.startsWith("Apenas arquivos")) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});
router.delete(
  "/recebimentos/:id/comprovante",
  removeComprovanteController
);

export default router;