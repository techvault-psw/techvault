import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import type { ReservaExtended } from "../../consts/types";
import { reservaExtendedZodSchema } from "../../consts/zod-schemas";
import { PopulatedReservaSchema, reservas } from "../../models/reserva";
import { PopulatedReservaFormatter, ReservaFormatter } from "../../formatters/reserva-formatter";

const router = CreateTypedRouter()

router.get('/reservas', {
  schema: {
    summary: 'Get Reservas',
    tags: ['Reservas'],
    response: {
      200: z.array(reservaExtendedZodSchema)
    },
  },
}, async (req, res) => {
  const dbReservas = await reservas.find({}).populate("clienteId pacoteId enderecoId") as PopulatedReservaSchema[]
  const formattedReservas = dbReservas.map(PopulatedReservaFormatter)

  return res.status(200).send(formattedReservas)
})

export const getReservas = router