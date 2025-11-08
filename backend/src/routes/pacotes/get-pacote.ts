import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { objectIdSchema, pacoteZodSchema } from "../../consts/zod-schemas";
import { pacotes } from "../../models/pacote";
import { PacoteFormatter } from "../../formatters/pacote-formatter";

const router = CreateTypedRouter()

router.get('/pacotes/:id', {
  schema: {
    summary: 'Get Pacote',
    tags: ['Pacotes'],
    params: z.object({
      id: objectIdSchema,
    }),
    response: {
      200: pacoteZodSchema,
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
  },
}, async (req, res) => {
  const { id } = req.params

  const pacote = await pacotes.findById(id)

  if(!pacote) {
    return res.status(400).send({
      success: false,
      message: 'Pacote não encontrado'
    })
  }

  const formattedPacote = PacoteFormatter(pacote)

  return res.status(200).send(formattedPacote)
})

export const getPacote = router