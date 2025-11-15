import z from "zod"
import { CreateTypedRouter } from "express-zod-openapi-typed";
import { enderecoZodSchema } from "../../consts/zod-schemas";
import { clientes } from "../../models/cliente";
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
      400: z.object({
        success: z.boolean(),
        message: z.string()
      }),
      401: z.object({
        success: z.boolean(),
        message: z.string()
      })
    },
  },
}, authValidator, async (req, res) => {
  const user = req.user!

  if(!user) {
    return res.status(401).send({
      success: false,
      message: 'Acesso não autorizado'
    })
  }

  const clienteId = user.id;
  const cliente = await clientes.findById(clienteId)

  if(!cliente) {
    return res.status(400).send({
      success: false,
      message: 'Cliente não encontrado'
    })
  }

  const endereco = await enderecos.create({
    clienteId,
    ...req.body
  })

  const formattedEndereco = EnderecoFormatter(endereco)

  return res.status(201).send(formattedEndereco)
})

export const createEndereco = router