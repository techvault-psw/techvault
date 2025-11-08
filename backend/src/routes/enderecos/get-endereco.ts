import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from 'zod'
import { enderecos, PopulatedEnderecoSchema } from "../../models/endereco"
import { enderecoExtendedZodSchema, objectIdSchema } from "../../consts/zod-schemas";
import { PopulatedEnderecoFormatter } from "../../formatters/endereco-formatter";

const router = CreateTypedRouter()

router.get('/enderecos/:id', {
  schema: {
    summary: 'Get Address',
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
    }
  }
}, async(req, res) => {
  const { id } = req.params

  const endereco = await enderecos.findById(id).populate("clienteId") as PopulatedEnderecoSchema

  if(!endereco) {
    return res.status(400).send({
      success: false,
      message: 'Endereco não encontrado'
    })
  }

  const formattedEndereco = PopulatedEnderecoFormatter(endereco)

  return res.status(200).send(formattedEndereco)
})

export const getEndereco = router