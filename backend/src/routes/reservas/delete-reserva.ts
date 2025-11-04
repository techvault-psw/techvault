import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { reservas } from "../../consts/db-mock";

const router = CreateTypedRouter()

router.delete('/reservas/:id', {
  schema: {
    summary: 'Delete Reserva',
    tags: ['Reservas'],
    params: z.object({
      id: z.string().uuid(),
    }),
    response: {
      200: z.object({
        reservaId: z.string().uuid(),
      }),
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

  reservas[reservaIndex].status = "Cancelada"

  return res.status(200).send({
    reservaId: id,
  })
})

export const deleteReserva = router