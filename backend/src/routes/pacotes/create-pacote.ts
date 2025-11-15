import { randomUUID } from "crypto";
import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { pacoteZodSchema } from "../../consts/zod-schemas";
import { pacotes } from "../../models/pacote";
import { PacoteFormatter } from "../../formatters/pacote-formatter";
import { authValidator, roleValidator } from "../../middlewares/auth";

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
}, authValidator, roleValidator('Gerente'), async (req, res) => {
  const { name, image, description, components, value, quantity } = req.body

  const pacoteExiste = await pacotes.findOne({name})

  if (pacoteExiste) {
    return res.status(400).send({
      success: false,
      message: 'Pacote com esse nome já existe'
    })
  }

  const imageExiste = await pacotes.findOne({image})

  if (imageExiste) {
    return res.status(400).send({
      success: false,
      message: 'Pacote com essa imagem já existe'
    })
  }

  const pacote = await pacotes.create({
    name, 
    image, 
    description, 
    components, 
    value, 
    quantity,
  })

  return res.status(201).send(PacoteFormatter(pacote))
})

export const createPacote = router