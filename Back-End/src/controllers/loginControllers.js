import handleResponse  from "../utils/handleError.js";
import { loginService } from "../service/loginService.js";

export const loginController = async (req, res, next) => {

  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      throw new Error("Email e senha são obrigatórios");
    }

    const resultado = await loginService(email, senha);

    return handleResponse(
      res,
      200,
      "Login realizado com sucesso",
      resultado
    );

  } catch (err) {
    next(err);
  }
};


export default loginController