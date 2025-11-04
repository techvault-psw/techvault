import { randomUUID } from "crypto";
import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { clientes } from "../../consts/db-mock";
import { clienteZodSchema } from "../../consts/zod-schemas";

const router = CreateTypedRouter()

router.post('/clientes', {
  schema: {
    summary: 'Create cliente',
    tags: ['Clientes'],
    body: clienteZodSchema.omit({ id: true }),
    response: {
      201: clienteZodSchema,
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      })
    },
  },
}, async (req, res) => {
  const { name, email, phone, registrationDate, password, role } = req.body

  const clienteExisteEmail = clientes.find((cliente) => cliente.email === email)
  const clienteExistePhone = clientes.find((cliente) => cliente.phone === phone)

  if (clienteExisteEmail) {
    return res.status(400).send({
      success: false,
      message: 'Cliente com esse email já existe'
    })
  }

    if (clienteExistePhone) {
    return res.status(400).send({
      success: false,
      message: 'Cliente com esse telefone já existe'
    })
  }

  const cliente = {
    id: randomUUID(),
    name,
    email,
    phone,
    registrationDate,
    password,
    role,
  }

  clientes.push(cliente)

  return res.status(201).send({
    ...cliente,
  })
})

export const createCliente= router