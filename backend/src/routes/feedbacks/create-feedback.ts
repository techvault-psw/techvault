import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { errorMessageSchema, feedbackZodSchema } from "../../consts/zod-schemas";
import { clientes } from "../../models/cliente";
import { pacotes } from "../../models/pacote";
import { reservas } from "../../models/reserva";
import { feedbacks } from "../../models/feedback";
import { FeedbackFormatter } from "../../formatters/feedback-formatter";
import { authValidator } from "../../middlewares/auth";

const router = CreateTypedRouter()

router.post('/feedbacks', {
  schema: {
    summary: 'Create Feedback',
    tags: ['Feedbacks'],
    body: feedbackZodSchema.omit({
      id: true,
      clienteId: true,
    }),
    response: {
      201: feedbackZodSchema,
      400: errorMessageSchema
    },
  },
}, authValidator, async (req, res) => {
  const { pacoteId, rating, comentario } = req.body
  const user = req.user!

  const pacote = await pacotes.findById(pacoteId)

  if (!pacote) {
    return res.status(400).send({
      success: false,
      message: 'Pacote não encontrado'
    })
  }

  const reserva = await reservas.findOne({
    clienteId: user.id,
    pacoteId,
    status: 'Concluída'
  })

  if (!reserva) {
    return res.status(400).send({
      success: false,
      message: 'Esse cliente ainda não concluiu nenhuma reserva com esse pacote',
    })
  }

  const feedback = await feedbacks.create({
    clienteId: user.id,
    pacoteId,
    rating,
    comentario,
  })

  const formattedFeedback = FeedbackFormatter(feedback)

  return res.status(201).send(formattedFeedback)
})

export const createFeedback = router