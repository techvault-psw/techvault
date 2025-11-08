import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { reservas } from "../../consts/db-mock";
import { objectIdSchema, reservaZodSchema } from "../../consts/zod-schemas";

const router = CreateTypedRouter()

router.patch('/reservas/:id/cancelar-reserva', {
  schema: {
    summary: 'Cancelar Reserva',
    tags: ['Reservas'],
    params: z.object({
      id: objectIdSchema,
    }),
    response: {
      200: reservaZodSchema,
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
  },
}, async (req, res) => {
  const { id } = req.params

  const reservaIndex = reservas.findIndex((reserva) => reserva.id === id)

  if (reservaIndex < 0) {
    return res.status(400).send({
      success: false,
      message: 'Reserva não encontrada'
    })
  }

  if (
    reservas[reservaIndex].dataEntrega ||
    reservas[reservaIndex].dataColeta ||
    reservas[reservaIndex].status === 'Concluída'
  ){
    return res.status(400).send({
      success: false,
      message: 'Essa reserva não pode ser cancelada.'
    })
  }

  reservas[reservaIndex].status = "Cancelada"

  return res.status(200).send({
    ...reservas[reservaIndex],
  })

})

export const cancelReserva = router