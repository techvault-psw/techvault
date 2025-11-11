import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { reservas } from "../../models/reserva";
import { objectIdSchema, reservaZodSchema } from "../../consts/zod-schemas";
import { ReservaFormatter } from "../../formatters/reserva-formatter";

const router = CreateTypedRouter()

router.patch('/reservas/:id/confirmar-entrega', {
  schema: {
    summary: 'Confirmar Entrega da Reserva',
    tags: ['Reservas'],
    params: z.object({
      id: objectIdSchema,
    }),
    body: reservaZodSchema.pick({
      codigoEntrega: true,
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
  const { codigoEntrega } = req.body

  const reserva = await reservas.findById(id)

  if (!reserva) {
    return res.status(400).send({
      success: false,
      message: 'Reserva não encontrada'
    })
  }
  
  if(reserva.dataEntrega){
    return res.status(400).send({
      success: false,
      message: 'Já foi registrada a entrega para esta reserva'
    })
  }

  if(codigoEntrega !== reserva.codigoEntrega){
    return res.status(400).send({
      success: false,
      message: 'Código de entrega inválido'
    })
  }

  reserva.dataEntrega = new Date()

  const updatedReserva = await reservas.findByIdAndUpdate(reserva.id, reserva, { new: true })
  const formattedReserva = ReservaFormatter(updatedReserva!)
  
  return res.status(200).send(formattedReserva)
})

export const confirmEntrega = router