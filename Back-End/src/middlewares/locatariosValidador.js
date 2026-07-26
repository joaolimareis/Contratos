import joi from "joi";

const locatarioSchema = joi.object({
    nome_locatario: joi.string().required(),
    tel_locatario: joi.string().required(),
    rua_locatario: joi.string(),
    bairro_locatario: joi.string(),
    cep_locatario: joi.string(),
    cpf_locatario: joi.string().required(),
    rg_locatario: joi.string(),
    uf_locatario: joi.string()



})

const validateLocatario = (req, res, next) =>{
  const {error} = locatarioSchema.validate(req.body);
  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message
  
    })
    next()
}

export default validateLocatario