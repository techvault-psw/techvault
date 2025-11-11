import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { objectIdSchema, reservaZodSchema } from "../../consts/zod-schemas";
import { reservas } from "../../models/reserva";
import { ReservaFormatter } from "../../formatters/reserva-formatter";

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

  const reserva = await reservas.findById(id)

  if (!reserva) {
    return res.status(400).send({
      success: false,
      message: 'Reserva não encontrada'
    })
  }

  if (
    reserva.dataEntrega ||
    reserva.dataColeta ||
    reserva.status === 'Concluída'
  ){
    return res.status(400).send({
      success: false,
      message: 'Essa reserva não pode ser cancelada.'
    })
  }

  reserva.status = "Cancelada"

  const updatedReserva = await reservas.findByIdAndUpdate(reserva.id, reserva, { new: true })
  const formattedReserva = ReservaFormatter(updatedReserva!)
  return res.status(200).send(formattedReserva)
})

export const cancelReserva = router