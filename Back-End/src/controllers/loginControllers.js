import handleResponse  from "../utils/handleError.js";
import { loginService } from "../service/usuariosService.js";

export const login = async (req, res, next) => {

    try {

        const { email, senha } = req.body;

        const token = await loginService(email, senha);

        handleResponse(res, 200, "Login realizado", token);

    } catch (err) {
        next(err);
    }

}

export default login