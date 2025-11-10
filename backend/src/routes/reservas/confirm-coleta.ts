import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { reservas } from "../../models/reserva";
import { objectIdSchema, reservaZodSchema } from "../../consts/zod-schemas";
import { ReservaFormatter } from "../../formatters/reserva-formatter";

const router = CreateTypedRouter()

router.patch('/reservas/:id/confirmar-coleta', {
  schema: {
    summary: 'Confirmar Coleta da Reserva',
    tags: ['Reservas'],
    params: z.object({
      id: objectIdSchema,
    }),
    body: reservaZodSchema.pick({
      codigoColeta: true,
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
  const { codigoColeta } = req.body

  const reserva = await reservas.findById(id)

  if (!reserva) {
    return res.status(400).send({
      success: false,
      message: 'Reserva não encontrada'
    })
  }

  if (!reserva.dataEntrega){
    return res.status(400).send({
      success: false,
      message: 'Ainda não foi registrada a entrega desta reserva'
    })
  }

  if (reserva.dataColeta){
    return res.status(400).send({
      success: false,
      message: 'Já foi registrada a coleta para esta reserva'
    })
  }


  if(codigoColeta !== reserva.codigoColeta){
    return res.status(400).send({
      success: false,
      message: 'Código de coleta inválido'
    })
  }

  reserva.dataColeta = new Date()
  
  reserva.status = "Concluída"

  const updatedReserva = await reservas.findByIdAndUpdate(reserva.id, reserva, { new: true })
  const formattedReserva = ReservaFormatter(updatedReserva!)
  return res.status(200).send(formattedReserva)


})

export const confirmColeta = router