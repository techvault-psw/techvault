import { CreateTypedRouter } from "express-zod-openapi-typed";
import { enderecoExtendedZodSchema } from "../../consts/zod-schemas";
import z from "zod"
import { enderecos, PopulatedEnderecoSchema } from "../../models/endereco";
import { PopulatedEnderecoFormatter } from "../../formatters/endereco-formatter";

const router = CreateTypedRouter()

router.get('/enderecos', {
  schema: {
    summary: 'Get Addresses',
    tags: ['Endereços'],
    response: {
      200: z.array(enderecoExtendedZodSchema)
    },
  }
}, async(req, res) => {
  const dbEnderecos = await enderecos.find({}).populate("clienteId") as PopulatedEnderecoSchema[]

  const formattedEnderecos = dbEnderecos
    .filter(e => e.clienteId)
    .map(PopulatedEnderecoFormatter)

  return res.status(200).send(formattedEnderecos)
})

export const getEnderecos = router