import joi from "joi";

const locadorSchema = joi.object({
    nome_locador: joi.string().required(),
    tel_locador: joi.string().required(),
    rua_locador: joi.string(),
    bairro_locador: joi.string(),
    cep_locador: joi.string(),
    cpf_locador: joi.string().required(),
    rg_locador: joi.string(),
    uf_locador: joi.string()



})

const validatelocador = (req, res, next) =>{
  const {error} = locadorSchema.validate(req.body);
  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message
  
    })

  next()
}


export default validatelocador