import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { reservas } from "../../consts/db-mock";
import { reservaZodSchema } from "../../consts/zod-schemas";

const router = CreateTypedRouter()

router.patch('/reservas/:id/confirmar-entrega', {
  schema: {
    summary: 'Confirmar Entrega da Reserva',
    tags: ['Reservas'],
    params: z.object({
      id: z.string().uuid(),
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
  const {codigoEntrega } = req.body // agora pode registrar coleta e entrega

  const reservaIndex = reservas.findIndex((reserva) => reserva.id === id)

  if (reservaIndex < 0) {
    return res.status(400).send({
      success: false,
      message: 'Reserva não encontrada'
    })
  }
  
  if(!reservas[reservaIndex].dataEntrega){
    return res.status(400).send({
      success: false,
      message: 'Já foi registrada a entrega para esta reserva'
    })
  }

  if(codigoEntrega !== reservas[reservaIndex].codigoEntrega){
    return res.status(400).send({
      success: false,
      message: 'Código de entrega inválido'
    })
  }

  

  reservas[reservaIndex].dataEntrega = new Date().toISOString()

  return res.status(200).send({
    ...reservas[reservaIndex],
  })

})

export const confirmEntrega = router