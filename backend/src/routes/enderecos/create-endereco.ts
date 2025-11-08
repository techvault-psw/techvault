import z from "zod"
import { CreateTypedRouter } from "express-zod-openapi-typed";
import { enderecoZodSchema } from "../../consts/zod-schemas";
import { clientes } from "../../models/cliente";
import { enderecos } from "../../models/endereco";
import { EnderecoFormatter } from "../../formatters/endereco-formatter";

const router = CreateTypedRouter()

router.post('/enderecos', {
  schema: {
    summary: 'Create Address',
    tags: ['Endereços'],
    body: enderecoZodSchema.omit({ id: true }),
    response: {
      201: enderecoZodSchema,
      400: z.object({
        success: z.boolean(),
        message: z.string()
      })
    },
  },
}, async (req, res) => {
  const { clienteId, ...rest } = req.body

  const cliente = await clientes.findById(clienteId)

  if(!cliente) {
    return res.status(400).send({
      success: false,
      message: 'Cliente não encontrado'
    })
  }

  const endereco = await enderecos.insertOne({
    clienteId,
    ...rest
  })

  const formattedEndereco = EnderecoFormatter(endereco)

  return res.status(201).send(formattedEndereco)
})

export const createEndereco = router