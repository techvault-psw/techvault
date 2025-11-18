import z from "zod"
import { CreateTypedRouter } from "express-zod-openapi-typed";
import { enderecoZodSchema, errorMessageSchema } from "../../consts/zod-schemas";
import { enderecos } from "../../models/endereco";
import { EnderecoFormatter } from "../../formatters/endereco-formatter";
import { authValidator } from "../../middlewares/auth";

const router = CreateTypedRouter()

router.post('/enderecos', {
  schema: {
    summary: 'Create Endereço',
    tags: ['Endereços'],
    body: enderecoZodSchema.omit({ 
      id: true,
      clienteId: true
    }),
    response: {
      201: enderecoZodSchema,
      400: errorMessageSchema,
      401: errorMessageSchema
    },
  },
}, authValidator, async (req, res) => {
  const user = req.user!

  const clienteId = user.id;

  const endereco = await enderecos.create({
    clienteId,
    ...req.body
  })

  const formattedEndereco = EnderecoFormatter(endereco)

  return res.status(201).send(formattedEndereco)
})

export const createEndereco = router