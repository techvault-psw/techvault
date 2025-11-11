import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { reservas } from "../../models/reserva";
import { objectIdSchema, reservaZodSchema } from "../../consts/zod-schemas";
import { ReservaFormatter } from "../../formatters/reserva-formatter";

const router = CreateTypedRouter()

router.put('/reservas/:id', {
  schema: {
    summary: 'Update Reserva',
    tags: ['Reservas'],
    params: z.object({
      id: objectIdSchema,
    }),
    body: reservaZodSchema.omit({
      id: true,
      clienteId: true,
      pacoteId: true,
      enderecoId: true,
      valor: true,
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
  const { dataEntrega, dataColeta, dataInicio, dataTermino, codigoColeta, codigoEntrega, status } = req.body
  
  const reserva = await reservas.findById(id)

  if (!reserva) {
    return res.status(400).send({
      success: false,
      message: 'Reserva não encontrada'
    })
  }


  const updatedReserva = await reservas.findByIdAndUpdate(id, {
    dataEntrega,
    dataColeta,
    dataInicio,
    dataTermino,
    codigoColeta,
    codigoEntrega,
    status,
  }, { new: true })

  const formattedReserva = ReservaFormatter(updatedReserva!)

  return res.status(200).send(formattedReserva)

})

export const updateReserva = router