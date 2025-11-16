import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { objectIdSchema } from "../../consts/zod-schemas";
import { clientes } from "../../models/cliente";
import { authValidator } from "../../middlewares/auth";

const router = CreateTypedRouter()

router.delete('/clientes/:id', {
  schema: {
    summary: 'Delete Cliente',
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

  if(user.id !== id && user.role !== 'Gerente' ){
    return res.status(403).json({
      success: false,
      message: 'Acesso não autorizado'
    })
  }

  await clientes.findByIdAndDelete(id)

  return res.status(200).send({
    clienteId: id,
  })
})

export const deleteCliente = router