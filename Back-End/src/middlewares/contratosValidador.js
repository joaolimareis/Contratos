import joi from "joi"

const contratosSchema = joi.object({

  locatario_id: joi.number().integer().required(),
  imovel_id: joi.number().integer().required(),
  data_inicio: joi.date().required(),
  data_fim: joi.date(),
  valor: joi.number().required(),
  status: joi.boolean()

})

const validateContratos = (req, res, next) =>{

  const {error} = contratosSchema.validate(req.body)
  if(error)
    return res.status(400).json({
        status: 400,
        message: error.details[0].message,

    })

    next();

};
export default validateContratos;