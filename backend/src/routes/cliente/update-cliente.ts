import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { clientes } from "../../consts/db-mock";
import { clienteZodSchema, objectIdSchema } from "../../consts/zod-schemas";

const router = CreateTypedRouter()

router.put('/clientes/:id', {
  schema: {
    summary: 'Update cliente',
    tags: ['Clientes'],
    params: z.object({
      id: objectIdSchema,
    }),
    body: clienteZodSchema.omit({
      id: true,
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
  const { name, email, phone, registrationDate, password, role } = req.body

  const clienteIndex = clientes.findIndex((cliente) => cliente.id === id)

  if (clienteIndex < 0) {
    return res.status(400).send({
      success: false,
      message: 'Cliente não encontrado'
    })
  }

  clientes[clienteIndex].name = name
  clientes[clienteIndex].email= email
  clientes[clienteIndex].phone = phone
  clientes[clienteIndex].registrationDate = registrationDate
  clientes[clienteIndex].password = password 
  clientes[clienteIndex].role = role 

  return res.status(200).send({
    ...clientes[clienteIndex],
  })

})

export const updateCliente = router