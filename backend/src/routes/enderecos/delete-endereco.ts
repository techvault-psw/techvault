import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from 'zod'
import { enderecos } from "../../models/endereco"
import { errorMessageSchema, objectIdSchema } from "../../consts/zod-schemas";
import { authValidator } from "../../middlewares/auth";

const router = CreateTypedRouter()

router.delete('/enderecos/:id', {
  schema: {
    summary: 'Delete Endereço',
    tags: ['Endereços'],
    params: z.object({
      id: objectIdSchema,
    }),
    response: {
      200: z.object({
        enderecoId: objectIdSchema,
      }),
      400: errorMessageSchema,
      401: errorMessageSchema,
      403: errorMessageSchema,
    }
  }
}, authValidator, async(req, res) => {
  const { id } = req.params
  const user = req.user!

  const endereco = await enderecos.findById(id)

  if(!endereco) {
    return res.status(400).send({
      success: false,
      message: 'Endereço não encontrado'
    })
  }

  if(user.id !== endereco.clienteId.toString() && user.role !== 'Gerente') {
    return res.status(403).send({
      success: false,
      message: 'Acesso não autorizado'
    })
  }

  await enderecos.findByIdAndDelete(id)

  return res.status(200).send({
    enderecoId: id,
  })
})

export const deleteEndereco = router