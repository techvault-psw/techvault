import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { clienteZodSchema, objectIdSchema } from "../../consts/zod-schemas";
import { clientes } from "../../models/cliente";
import { ClienteFormatter } from "../../formatters/cliente-formatter";

const router = CreateTypedRouter()

router.put('/clientes/:id', {
  schema: {
    summary: 'Update Cliente',
    tags: ['Clientes'],
    params: z.object({
      id: objectIdSchema,
    }),
    body: clienteZodSchema.omit({
      id: true,
      registrationDate: true,
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
  const { name, email, phone, password, role } = req.body

  const cliente = await clientes.findById(id)

  if (!cliente) {
    return res.status(400).send({
      success: false,
      message: 'Cliente não encontrado'
    })
  }

  const updateCliente = await clientes.findByIdAndUpdate(
    id,
    {name, email, phone, password, role},
    {new : true}
  )

  const formattedCliente = ClienteFormatter(updateCliente!)

  return res.status(200).send(formattedCliente)
})

export const updateCliente = router