import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { enderecos } from "../../consts/db-mock";
import { enderecoZodSchema, objectIdSchema } from "../../consts/zod-schemas";

const router = CreateTypedRouter()

router.put('/enderecos/:id', {
  schema: {
    summary: 'Update Address',
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

  const clienteId = enderecos[enderecoIndex].clienteId

  enderecos[enderecoIndex] = {
    id,
    clienteId,
    ...newEndereco
  }

  return res.status(200).send({
    ...enderecos[enderecoIndex],
  })
})

export const updateEndereco = router