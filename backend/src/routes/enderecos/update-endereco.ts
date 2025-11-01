import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod"
import { enderecoZodSchema } from "../../consts/zod-schemas";
import { enderecos } from "../../consts/db-mock";

const router = CreateTypedRouter()

router.put('/enderecos/:id', {
  schema: {
    summary: 'Update Address',
    tags: ['Endereços'],
    params: z.object({
      id: z.string().uuid(),
    }),
    body: enderecoZodSchema.omit({ id: true }),
    response: {
      200: enderecoZodSchema,
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
  },
}, async (req, res) => {
  const { id } = req.params
  const newEndereco = req.body

  const enderecoIndex = enderecos.findIndex((endereco) => endereco.id === id)

  if(enderecoIndex < 0) {
    return res.status(400).send({
      success: false,
      message: 'Endereço não encontrado'
    })
  }

  enderecos[enderecoIndex] = {
    ...newEndereco,
    id: id
  }

  return res.status(200).send({
    ...enderecos[enderecoIndex],
  })
})

export const updateEndereco = router