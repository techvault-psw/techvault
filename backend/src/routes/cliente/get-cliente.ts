import { CreateTypedRouter } from "express-zod-openapi-typed";
import z, { success } from "zod";
import { clienteZodSchema, objectIdSchema } from "../../consts/zod-schemas";
import { clientes } from "../../models/cliente";
import { ClienteFormatter } from "../../formatters/cliente-formatter";
import { authValidator } from "../../middlewares/auth";

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
      403: z.object({
        success: z.boolean(),
        message: z.string(),
      })
    },
  },
},authValidator , async (req, res) => {
  const { id } = req.params
  const user = req.user!

  const cliente = await clientes.findById(id)

  if (!cliente) {
    return res.status(400).send({
      success: false,
      message: 'Cliente não encontrado'
    })
  }

  if(user.id !== id && user.role === 'Cliente' ){
    return res.status(403).json({
      success: false,
      message: 'Acesso não autorizado'
    })
  }

  const formattedCliente = ClienteFormatter(cliente)
  
  return res.status(200).send(formattedCliente)
})

export const getCliente = router