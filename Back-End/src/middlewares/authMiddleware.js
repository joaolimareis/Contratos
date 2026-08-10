import jwt from "jsonwebtoken";

export const authMiddlewares = (req, res , next) =>{
    try{
        const authHeader = req.hearders.aurthorization;

        if (!authHeader){
            return res.status(401).json({
                status: 401,
                message: "Token de autenticação nao informado"
            })
        }
        const [type, token] = authHearder.split(" ");

        if(!type !== "Bearer" || !token){
            return res.status(401).json({
                status: 401,
                message: "Formato do token invalido"
            });
        }
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
      );

      req.user = decoded

      next()
    } catch (error){
        return res.status(401).json({
            status: 401,
            message: "Token invalido ou expirado"
        })
    }

}

export default authMiddlewares