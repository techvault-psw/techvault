import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { clientes, enderecos, pacotes, reservas } from "../../consts/db-mock";
import type { ReservaExtended } from "../../consts/types";
import { reservaExtendedZodSchema } from "../../consts/zod-schemas";

const router = CreateTypedRouter()

router.get('/reservas', {
  schema: {
    summary: 'Get Reservas',
    tags: ['Reservas'],
    response: {
      200: z.object({
        reservas: z.array(reservaExtendedZodSchema)
      }),
    },
  },
}, async (req, res) => {
  const extendedReservas: ReservaExtended[] = reservas.map((reserva) => {
    const cliente = clientes.find((cliente) => cliente.id === reserva.clienteId)
    const pacote = pacotes.find((pacote) => pacote.id === reserva.pacoteId)
    const endereco = enderecos.find((endereco) => endereco.id === reserva.enderecoId)

    if (!cliente || !pacote || !endereco) return undefined;
    
    return {
      ...reserva,
      cliente,
      endereco,
      pacote,
    }
  }).filter((f) => !!f)

  return res.status(200).send({
    reservas: extendedReservas,
  })
})

export const getReservas = router