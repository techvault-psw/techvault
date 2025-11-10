import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { clienteZodSchema, objectIdSchema } from "../../consts/zod-schemas";
import { clientes } from "../../models/cliente";
import { ClienteFormatter } from "../../formatters/cliente-formatter";

const router = CreateTypedRouter()

router.get('/clientes/:id', {
  schema: {
    summary: 'Get Cliente',
    tags: ['Clientes'],
    params: z.object({
      id: objectIdSchema,
    }),
    response: {
      200: clienteZodSchema, 
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

  const formattedCliente = ClienteFormatter(cliente)
  
  return res.status(200).send(formattedCliente)
})

export const getCliente = router