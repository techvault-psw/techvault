import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { clientes } from "../../consts/db-mock";

const router = CreateTypedRouter()

router.delete('/clientes/:id', {
  schema: {
    summary: 'Delete cliente',
    tags: ['Clientes'],
    params: z.object({
      id: z.string().uuid(),
    }),
    response: {
      200: z.object({
        clienteId: z.string().uuid(),
      }),
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
  },
}, async (req, res) => {
  const { id } = req.params

  const clienteIndex = clientes.findIndex((cliente) => cliente.id === id)

  if (clienteIndex < 0) {
    return res.status(400).send({
      success: false,
      message: 'Cliente não encontrado'
    })
  }

  clientes.splice(clienteIndex, 1)

  return res.status(200).send({
    clienteId: id,
  })
})

export const deleteCliente = router