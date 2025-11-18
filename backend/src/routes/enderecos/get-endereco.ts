import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from 'zod'
import { enderecos, PopulatedEnderecoSchema } from "../../models/endereco"
import { enderecoExtendedZodSchema, errorMessageSchema, objectIdSchema } from "../../consts/zod-schemas";
import { PopulatedEnderecoFormatter } from "../../formatters/endereco-formatter";
import { authValidator } from "../../middlewares/auth";

const router = CreateTypedRouter()

router.get('/enderecos/:id', {
  schema: {
    summary: 'Get Endereço',
    tags: ['Endereços'],
    params: z.object({
      id: objectIdSchema
    }),
    response: {
      200: enderecoExtendedZodSchema,
      400: errorMessageSchema,
      401: errorMessageSchema,
      403: errorMessageSchema
    }
  }
}, authValidator, async(req, res) => {
  const { id } = req.params
  const user = req.user!

  const endereco = await enderecos.findById(id).populate("clienteId") as PopulatedEnderecoSchema

  if(!endereco || !endereco.clienteId) {
    return res.status(400).send({
      success: false,
      message: 'Endereço não encontrado'
    })
  }

  const formattedEndereco = PopulatedEnderecoFormatter(endereco)

  if(user.role === 'Cliente' && user.id !== formattedEndereco.clienteId) {
    return res.status(403).send({
      success: false,
      message: 'Acesso não autorizado'
    })
  }

  return res.status(200).send(formattedEndereco)
})

export const getEndereco = router