import { CreateTypedRouter } from "express-zod-openapi-typed";
import { enderecoExtendedZodSchema } from "../../consts/zod-schemas";
import z from "zod"
import { EnderecoExtended } from "../../consts/types";
import { clientes, enderecos } from "../../consts/db-mock";

const router = CreateTypedRouter()

router.get('/enderecos', {
  schema: {
    summary: 'Get Addresses',
    tags: ['Endereços'],
    response: {
      200: z.object({
        enderecos: z.array(enderecoExtendedZodSchema)
      }),
    }
  }
}, async(req, res) => {
  const extendedEnderecos: EnderecoExtended[] = enderecos.map((endereco) => {
    const cliente = clientes.find((cliente) => cliente.id === endereco.clienteId)

    if(!cliente) return undefined

    return {
      ...endereco,
      cliente
    }
  }).filter((f) => !!f)

  return res.status(200).send({
    enderecos: extendedEnderecos
  })
})

export const getEnderecos = router