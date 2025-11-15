import { CreateTypedRouter } from "express-zod-openapi-typed";
import { enderecoExtendedZodSchema } from "../../consts/zod-schemas";
import z from "zod"
import { enderecos, PopulatedEnderecoSchema } from "../../models/endereco";
import { PopulatedEnderecoFormatter } from "../../formatters/endereco-formatter";
import { authValidator } from "../../middlewares/auth";

const router = CreateTypedRouter()

router.get('/enderecos', {
  schema: {
    summary: 'Get Endereços',
    tags: ['Endereços'],
    response: {
      200: z.array(enderecoExtendedZodSchema),
      401: z.object({
        success: z.boolean(),
        message: z.string()
      })
    },
  }
}, authValidator, async(req, res) => {
  const user = req.user!
  if(!user) {
    return res.status(401).send({
      success: false,
      message: 'Acesso não autorizado'
    })
  }

  const dbEnderecos = await enderecos.find({}).populate("clienteId") as PopulatedEnderecoSchema[]

  const formattedEnderecos = dbEnderecos
    .filter(e => e.clienteId)
    .map(PopulatedEnderecoFormatter)

  return res.status(200).send(formattedEnderecos)
})

export const getEnderecos = router