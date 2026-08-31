import handleResponse from "../utils/handleError.js";
import { loginService } from "../service/loginService.js";
import AppError from "../utils/statusCode.js";

export const loginController = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      throw new AppError(
        "Email e senha são obrigatórios",
        400
      );
    }

    const resultado = await loginService(email, senha);

    console.log("LOGIN REALIZADO");
    console.log("TOKEN GERADO:", !!resultado.token);

    res.cookie("contratos_token", resultado.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600000,
      path: "/",
    });

    return handleResponse(
      res,
      200,
      "Login realizado com sucesso",
      {
        usuario: resultado.usuario,
      }
    );

  } catch (err) {
    next(err);
  }
};

export default loginController;