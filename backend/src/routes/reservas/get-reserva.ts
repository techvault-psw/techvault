import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { errorMessageSchema, objectIdSchema, reservaExtendedZodSchema } from "../../consts/zod-schemas";
import { PopulatedReservaSchema, reservas } from "../../models/reserva";
import { PopulatedReservaFormatter, ReservaFormatter } from "../../formatters/reserva-formatter";
import { authValidator } from "../../middlewares/auth";

const router = CreateTypedRouter()

router.get('/reservas/:id', {
  schema: {
    summary: 'Get Reserva',
    tags: ['Reservas'],
    params: z.object({
      id: objectIdSchema,
    }),
    response: {
      200: reservaExtendedZodSchema,
      400: errorMessageSchema,
      403: errorMessageSchema
    },
  },
}, authValidator, async (req, res) => {
  const { id } = req.params
  const user = req.user!

  const reserva = await reservas.findById(id).populate("clienteId pacoteId enderecoId") as PopulatedReservaSchema

  if (!reserva || !reserva.clienteId || !reserva.pacoteId || !reserva.enderecoId) {
    return res.status(400).send({
      success: false,
      message: 'Reserva não encontrada'
    })
  }


  if(user.role === 'Cliente' && user.id !== reserva.clienteId._id.toString()) {
    return res.status(403).send({
      success: false,
      message: 'Acesso não autorizado.'
    })
  }

  const formattedReserva = PopulatedReservaFormatter(reserva)

  return res.status(200).send(formattedReserva)
})

export const getReserva = router