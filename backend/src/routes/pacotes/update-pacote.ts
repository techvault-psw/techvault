import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { pacotes } from "../../consts/db-mock";
import { objectIdSchema, pacoteZodSchema } from "../../consts/zod-schemas";

const router = CreateTypedRouter()

router.put('/pacotes/:id', {
  schema: {
    summary: 'Update Pacote',
    tags: ['Pacotes'],
    params: z.object({
      id: objectIdSchema,
    }),
    body: pacoteZodSchema.omit({
      id: true,
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
  const { name, image, description, components, value, quantity } = req.body

  const pacoteIndex = pacotes.findIndex((pacote) => pacote.id === id)

  if (pacoteIndex < 0) {
    return res.status(400).send({
      success: false,
      message: 'Pacote não encontrado'
    })
  }

  pacotes[pacoteIndex].name = name
  pacotes[pacoteIndex].image = image
  pacotes[pacoteIndex].description = description
  pacotes[pacoteIndex].components = components
  pacotes[pacoteIndex].value = value
  pacotes[pacoteIndex].quantity = quantity

  return res.status(200).send({
    ...pacotes[pacoteIndex],
  })

})

export const updatePacote = router