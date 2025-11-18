import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { errorMessageSchema, objectIdSchema, pacoteZodSchema } from "../../consts/zod-schemas";
import { pacotes } from "../../models/pacote";
import { PacoteFormatter } from "../../formatters/pacote-formatter";
import { authValidator, roleValidator } from "../../middlewares/auth";

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
      400: errorMessageSchema
    },
  },
}, authValidator, roleValidator('Gerente'), async (req, res) => {
  const { id } = req.params
  const { name, image, description, components, value, quantity } = req.body

  const pacote = await pacotes.findById(id)

  if(!pacote) {
    return res.status(400).send({
      success: false,
      message: 'Pacote não encontrado'
    })
  }

  const updatedPacote = await pacotes.findByIdAndUpdate(
    id,
    { name, image, description, components, value, quantity },
    {new: true}
  )

  const formattedPacote = PacoteFormatter(updatedPacote!)

  return res.status(200).send(formattedPacote)

})

export const updatePacote = router