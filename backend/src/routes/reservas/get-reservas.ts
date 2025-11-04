import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { reservas } from "../../consts/db-mock";
import type { Reserva } from "../../consts/types";
import { reservaZodSchema } from "../../consts/zod-schemas";

const router = CreateTypedRouter()

router.get('/reservas', {
  schema: {
    summary: 'Get Reservas',
    tags: ['Reservas'],
    response: {
      200: z.object({
        reservas: z.array(reservaZodSchema)
      }),
    },
  },
}, async (req, res) => {

  return res.status(200).send({
    reservas,
  })
})

export const getReservas = router