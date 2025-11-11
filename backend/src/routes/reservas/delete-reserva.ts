import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { objectIdSchema } from "../../consts/zod-schemas";
import { reservas } from "../../models/reserva";

const router = CreateTypedRouter()

router.delete('/reservas/:id', {
  schema: {
    summary: 'Delete Reserva',
    tags: ['Reservas'],
    params: z.object({
      id: objectIdSchema,
    }),
    response: {
      200: z.object({
        reservaId: objectIdSchema,
      }),
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

  await reservas.findByIdAndDelete(id)

  return res.status(200).send({
    reservaId: id,
  })
})

export const deleteReserva = router