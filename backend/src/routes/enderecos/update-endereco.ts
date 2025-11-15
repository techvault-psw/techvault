import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod"
import { enderecoZodSchema, objectIdSchema } from "../../consts/zod-schemas";
import { enderecos } from "../../models/endereco";
import { EnderecoFormatter } from "../../formatters/endereco-formatter";
import { authValidator } from "../../middlewares/auth";

const router = CreateTypedRouter()

router.put('/enderecos/:id', {
  schema: {
    summary: 'Update Endereço',
    tags: ['Endereços'],
    params: z.object({
      id: objectIdSchema,
    }),
    body: enderecoZodSchema.omit({ 
      id: true,
      clienteId: true, 
    }),
    response: {
      200: enderecoZodSchema,
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      401: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      403: z.object({
        success: z.boolean(),
        message: z.string(),
      })
    },
  },
}, authValidator, async (req, res) => {
  const { id } = req.params
  const newEndereco = req.body
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

  const updatedEndereco = await enderecos.findByIdAndUpdate(
    id,
    newEndereco,
    {new: true}
  )

  const formattedEndereco = EnderecoFormatter(updatedEndereco!)

  return res.status(200).send(formattedEndereco)
})

export const updateEndereco = router