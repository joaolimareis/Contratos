import Joi from "joi";

const usuariosSchema = Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

})
const validateUsuarios = (req, res, next) =>{

  const {error} = usuariosSchema.validate(req.body);
  if(error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
  
    })
      next()
}

export default validateUsuarios