import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { reservas } from "../../consts/db-mock";
import { objectIdSchema, reservaZodSchema } from "../../consts/zod-schemas";

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

  const reservaIndex = reservas.findIndex((reserva) => reserva.id === id)

  if (reservaIndex < 0) {
    return res.status(400).send({
      success: false,
      message: 'Reserva não encontrada'
    })
  }
  
  reservas[reservaIndex].dataEntrega = dataEntrega
  reservas[reservaIndex].dataColeta = dataColeta
  reservas[reservaIndex].dataInicio = dataInicio
  reservas[reservaIndex].dataTermino = dataTermino
  reservas[reservaIndex].codigoColeta = codigoColeta
  reservas[reservaIndex].codigoEntrega = codigoEntrega
  reservas[reservaIndex].status = status

  return res.status(200).send({
    ...reservas[reservaIndex],
  })

})

export const updateReserva = router