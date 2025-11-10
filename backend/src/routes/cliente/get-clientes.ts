import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import type { Cliente } from "../../consts/types";
import { clienteZodSchema } from "../../consts/zod-schemas";
import { clientes } from "../../models/cliente";
import { ClienteFormatter } from "../../formatters/cliente-formatter";

const router = CreateTypedRouter()

router.get('/clientes', {
  schema: {
    summary: 'Get Clientes',
    tags: ['Clientes'],
    response: {
      200: z.array(clienteZodSchema)
    },
  },
}, async (req, res) => {
 
  const dbCliente = await clientes.find({})
  const formattedCliente = dbCliente.map(ClienteFormatter)

  return res.status(200).send(formattedCliente)
})

export const getClientes = router