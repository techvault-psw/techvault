import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { errorMessageSchema, objectIdSchema } from "../../consts/zod-schemas";
import { pacotes } from "../../models/pacote";
import { authValidator, roleValidator } from "../../middlewares/auth";

const router = CreateTypedRouter()

router.delete('/pacotes/:id', {
  schema: {
    summary: 'Delete Pacote',
    tags: ['Pacotes'],
    params: z.object({
      id: objectIdSchema,
    }),
    response: {
      200: z.object({
        pacoteId: objectIdSchema,
      }),
      400: errorMessageSchema
    },
  },
}, authValidator, roleValidator('Gerente'), async (req, res) => {
  const { id } = req.params

  const pacote = await pacotes.findById(id)

  if(!pacote) {
    return res.status(400).send({
      success: false,
      message: 'Pacote não encontrado'
    })
  }

  await pacotes.findByIdAndDelete(id)

  return res.status(200).send({
    pacoteId: id,
  })
})

export const deletePacote = router