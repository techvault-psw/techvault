import { randomUUID } from "crypto";
import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { pacotes } from "../../consts/db-mock";
import { pacoteZodSchema } from "../../consts/zod-schemas";

const router = CreateTypedRouter()

router.post('/pacotes', {
  schema: {
    summary: 'Create Pacote',
    tags: ['Pacotes'],
    body: pacoteZodSchema.omit({ id: true }),
    response: {
      201: pacoteZodSchema,
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      })
    },
  },
}, async (req, res) => {
  const { name, image, description, components, value, quantity } = req.body

  const pacoteExiste = pacotes.find((pacote) => pacote.name === name)

  if (pacoteExiste) {
    return res.status(400).send({
      success: false,
      message: 'Pacote com esse nome já existe'
    })
  }

  const imageExiste = pacotes.find((pacote) => pacote.image === image)

  if (imageExiste) {
    return res.status(400).send({
      success: false,
      message: 'Pacote com essa imagem já existe'
    })
  }

  const pacote = {
    id: randomUUID(),
    name, 
    image, 
    description, 
    components, 
    value, 
    quantity,
  }

  pacotes.push(pacote)

  return res.status(201).send({
    ...pacote,
  })
})

export const createPacote = router