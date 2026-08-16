// import express from "express";
// import login from "../controllers/loginControllers.js";

// const router = express.Router();

// /**
//  * @swagger
//  * tags:
//  *   name: Auth
//  *   description: Authentication management API
//  */

// /**
//  * @swagger
//  * /api/login:
//  *   post:
//  *     summary: User login
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 example: usuario@email.com
//  *               senha:
//  *                 type: string
//  *                 example: suaSenha123
//  *     responses:
//  *       200:
//  *         description: Login successful, returns token
//  *       401:
//  *         description: Invalid credentials
//  */
// router.post("/login", login);

// export default router;