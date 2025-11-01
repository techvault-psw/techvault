import z from "zod"
import { randomUUID } from "crypto";
import { CreateTypedRouter } from "express-zod-openapi-typed";
import { enderecoZodSchema } from "../../consts/zod-schemas";
import { clientes, enderecos } from "../../consts/db-mock";

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
  const { clienteId } = req.body

  const cliente = clientes.find((cliente) => cliente.id === clienteId)

  if(!cliente) {
    return res.status(400).send({
      success: false,
      message: 'Cliente não encontrado'
    })
  }

  const endereco = {
    ...req.body,
    id: randomUUID(),
    clienteId,
  }

  enderecos.push(endereco)

  return res.status(201).send({
    ...endereco
  })
})

export const createEndereco = router