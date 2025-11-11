import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from 'zod'
import { enderecos } from "../../models/endereco"
import { objectIdSchema } from "../../consts/zod-schemas";

const router = CreateTypedRouter()

router.delete('/enderecos/:id', {
  schema: {
    summary: 'Delete Address',
    tags: ['Endereços'],
    params: z.object({
      id: objectIdSchema,
    }),
    response: {
      200: z.object({
        enderecoId: objectIdSchema,
      }),
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    }
  }
}, async(req, res) => {
  const { id } = req.params

  const endereco = await enderecos.findById(id)

  if(!endereco) {
    return res.status(400).send({
      success: false,
      message: 'Endereco não encontrado'
    })
  }

  await enderecos.findByIdAndDelete(id)

  return res.status(200).send({
    enderecoId: id,
  })
})

export const deleteEndereco = router