import Joi from "joi";

const usuariosSchema = Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string()
    .min(8)
    .pattern(/[A-Z]/)
    .pattern(/[a-z]/)
    .pattern(/[0-9]/)
    .pattern(/[!@#$%^&*]/)
    .required(),
    status: Joi.boolean()
})
export const validateUsuarios = (req, res, next) =>{

  const {error} = usuariosSchema.validate(req.body);
  if(error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
  
    })
      next()
}

export default validateUsuarios
