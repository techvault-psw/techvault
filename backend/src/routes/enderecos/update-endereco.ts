import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod"
import { enderecoZodSchema, objectIdSchema } from "../../consts/zod-schemas";
import { enderecos } from "../../models/endereco";
import { EnderecoFormatter } from "../../formatters/endereco-formatter";

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

  const endereco = enderecos.findById(id)

  if(!endereco) {
    return res.status(400).send({
      success: false,
      message: 'Endereço não encontrado'
    })
  }

  const updatedEndereco = await enderecos.findByIdAndUpdate(
    id,
    newEndereco,
    {new: true}
  )

  const formattedEndereco = EnderecoFormatter(updatedEndereco!)

  return res.status(200).send(formattedEndereco)
})

export const updateEndereco = router