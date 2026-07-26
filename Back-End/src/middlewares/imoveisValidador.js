import joi from "joi";

const imoveisSchema = joi.object({
  locador_id: joi.number().integer().required(),
  endereco: joi.string().required(),
  numero: joi.number(),
  status: joi.boolean(),
})

const valiadeImoveis = (req, res, next) =>{
  const {error} = imoveisSchema.validate(req.body)

  if(error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message
  
    })
    next()

}

export default valiadeImoveis