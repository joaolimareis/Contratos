import joi from "joi"

const recebimentoSchema = joi.object({
    contrato_id: joi.number()
        .integer()
        .required(),

    data_vencimento: joi.date()
        .required(),

    data_pagamento: joi.date(),

    valor_cobrado: joi.number()
        .positive()
        .required(),

    valor_recebido: joi.number()
        .positive(),

    status: joi.string()
        .valid(
            "pendente",
            "pago",
            "atrasado",
            "cancelado"
        )
});

const validateRecebimentos = (req, res, next) =>{
  const {error} = recebimentoSchema.validate(req.body)
  if(error) 
    return res.status(400).json({
    status: 400,
    message: error.details[0].message
})
  next()
}
export default validateRecebimentos