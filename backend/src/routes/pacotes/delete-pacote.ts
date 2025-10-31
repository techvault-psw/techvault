import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { pacotes } from "../../consts/db-mock";

const router = CreateTypedRouter()

router.delete('/pacotes/:id', {
  schema: {
    summary: 'Delete Pacote',
    tags: ['Pacotes'],
    params: z.object({
      id: z.string().uuid(),
    }),
    response: {
      200: z.object({
        pacoteId: z.string().uuid(),
      }),
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
  },
}, async (req, res) => {
  const { id } = req.params

  const pacoteIndex = pacotes.findIndex((pacote) => pacote.id === id)

  if (pacoteIndex < 0) {
    return res.status(400).send({
      success: false,
      message: 'Pacote não encontrado'
    })
  }

  pacotes.splice(pacoteIndex, 1)

  return res.status(200).send({
    pacoteId: id,
  })
})

export const deletePacote = router