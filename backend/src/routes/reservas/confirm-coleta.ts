import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { reservas } from "../../consts/db-mock";
import { reservaZodSchema } from "../../consts/zod-schemas";

const router = CreateTypedRouter()

router.patch('/reservas/:id/confirmar-coleta', {
  schema: {
    summary: 'Confirmar Coleta da Reserva',
    tags: ['Reservas'],
    params: z.object({
      id: z.string().uuid(),
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

  const reservaIndex = reservas.findIndex((reserva) => reserva.id === id)

  if (reservaIndex < 0) {
    return res.status(400).send({
      success: false,
      message: 'Reserva não encontrada'
    })
  }

  if (!reservas[reservaIndex].dataEntrega){
    return res.status(400).send({
      success: false,
      message: 'Ainda não foi registrada a entrega desta reserva'
    })
  }

  if (reservas[reservaIndex].dataColeta){
    return res.status(400).send({
      success: false,
      message: 'Já foi registrada a coleta para esta reserva'
    })
  }

  if(codigoColeta !== reservas[reservaIndex].codigoColeta){
    return res.status(400).send({
      success: false,
      message: 'Código de coleta inválido'
    })
  }

  reservas[reservaIndex].dataColeta = new Date().toISOString()
  reservas[reservaIndex].status = "Concluída"

  return res.status(200).send({
    ...reservas[reservaIndex],
  })

})

export const confirmColeta = router