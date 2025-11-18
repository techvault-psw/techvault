import { CreateTypedRouter } from "express-zod-openapi-typed";
import { enderecoExtendedZodSchema, errorMessageSchema } from "../../consts/zod-schemas";
import z from "zod"
import { enderecos, PopulatedEnderecoSchema } from "../../models/endereco";
import { PopulatedEnderecoFormatter } from "../../formatters/endereco-formatter";
import { authValidator } from "../../middlewares/auth";

const router = CreateTypedRouter()

router.get('/enderecos', {
  schema: {
    summary: 'Get Endereços',
    tags: ['Endereços'],
    response: {
      200: z.array(enderecoExtendedZodSchema),
      401: errorMessageSchema
    },
  }
}, authValidator, async(req, res) => {
  const dbEnderecos = await enderecos.find({}).populate("clienteId") as PopulatedEnderecoSchema[]

  const formattedEnderecos = dbEnderecos
    .filter(e => e.clienteId)
    .map(PopulatedEnderecoFormatter)

  return res.status(200).send(formattedEnderecos)
})

export const getEnderecos = router