import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from 'zod'
import { enderecos } from "../../consts/db-mock";

const router = CreateTypedRouter()

router.delete('/enderecos/:id', {
  schema: {
    summary: 'Delete Address',
    tags: ['Endereços'],
    params: z.object({
      id: z.string().uuid(),
    }),
    response: {
      200: z.object({
        enderecoId: z.string().uuid(),
      }),
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    }
  }
}, async(req, res) => {
  const { id } = req.params

  const enderecoIndex = enderecos.findIndex((endereco) => endereco.id === id)

  if(enderecoIndex < 0) {
    return res.status(400).send({
      success: false,
      message: 'Endereco não encontrado'
    })
  }

  enderecos.splice(enderecoIndex, 1)

  return res.status(200).send({
    enderecoId: id,
  })
})

export const deleteEndereco = router