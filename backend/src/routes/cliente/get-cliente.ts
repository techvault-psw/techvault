import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { clientes } from "../../consts/db-mock";
import type { Cliente } from "../../consts/types";
import { clienteZodSchema } from "../../consts/zod-schemas";

const router = CreateTypedRouter()

router.get('/clientes', {
  schema: {
    summary: 'Get clientes',
    tags: ['Clientes'],
    response: {
      200: z.object({
        clientes: z.array(clienteZodSchema)
      }),
    },
  },
}, async (req, res) => {
  const cliente: Cliente[] = clientes.map((clientes) => {
    
    return {
      ...clientes,
    }
  }).filter((f) => !!f)

  return res.status(200).send({
    clientes: cliente,
  })
})

export const getCliente = router