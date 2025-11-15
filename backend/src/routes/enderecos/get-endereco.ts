import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from 'zod'
import { enderecos, PopulatedEnderecoSchema } from "../../models/endereco"
import { enderecoExtendedZodSchema, objectIdSchema } from "../../consts/zod-schemas";
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
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      401: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      403: z.object({
        success: z.boolean(),
        message: z.string(),
      })
    }
  }
}, authValidator, async(req, res) => {
  const { id } = req.params
  const user = req.user!

  if(!user) {
    return res.status(401).send({
      success: false,
      message: 'Acesso não autorizado'
    })
  }

  const endereco = await enderecos.findById(id).populate("clienteId") as PopulatedEnderecoSchema

  if(!endereco || !endereco.clienteId) {
    return res.status(400).send({
      success: false,
      message: 'Endereco não encontrado'
    })
  }

  if(user.role === 'Cliente' && user.id !== endereco.clienteId.toString()) {
    return res.status(403).send({
      success: false,
      message: 'Acesso não autorizado'
    })
  }

  const formattedEndereco = PopulatedEnderecoFormatter(endereco)

  return res.status(200).send(formattedEndereco)
})

export const getEndereco = router