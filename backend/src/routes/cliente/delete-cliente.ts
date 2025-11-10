import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { objectIdSchema } from "../../consts/zod-schemas";
import { clientes } from "../../models/cliente";

const router = CreateTypedRouter()

router.delete('/clientes/:id', {
  schema: {
    summary: 'Delete cliente',
    tags: ['Clientes'],
    params: z.object({
      id: objectIdSchema,
    }),
    response: {
      200: z.object({
        clienteId: objectIdSchema,
      }),
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
  },
}, async (req, res) => {
  const { id } = req.params

  const cliente = await clientes.findById(id)

  if (!cliente) {
    return res.status(400).send({
      success: false,
      message: 'Cliente não encontrado'
    })
  }

  await clientes.findByIdAndDelete(id)

  return res.status(200).send({
    clienteId: id,
  })
})

export const deleteCliente = router