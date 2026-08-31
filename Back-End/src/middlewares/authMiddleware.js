import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    console.log("COOKIES RECEBIDOS:", req.cookies);

    const token = req.cookies.contratos_token;

    console.log("TOKEN RECEBIDO:", token);

    if (!token) {
      return res.status(401).json({
        message: "Não autenticado",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("TOKEN VALIDADO:", decoded);

    req.usuario = decoded;

    next();

  } catch (error) {
    console.error("ERRO JWT:", error);

    return res.status(401).json({
      message: "Token inválido ou expirado",
    });
  }
};

export default authMiddleware;