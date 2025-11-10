import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { clienteZodSchema } from "../../consts/zod-schemas";
import { clientes } from "../../models/cliente";
import { ClienteFormatter } from "../../formatters/cliente-formatter";

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

  const clienteExisteEmail = await clientes.findOne({email})
  const clienteExistePhone = await clientes.findOne({email})

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

  const cliente = await clientes.insertOne({
    name,
    email,
    phone,
    registrationDate,
    password,
    role,
  })

  const formattedCliente = ClienteFormatter(cliente)

  return res.status(201).send(formattedCliente)
})

export const createCliente= router