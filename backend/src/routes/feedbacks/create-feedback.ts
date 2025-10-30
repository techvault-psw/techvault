import { randomUUID } from "crypto";
import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { clientes, feedbacks, pacotes, reservas } from "../../consts/db-mock";
import { feedbackZodSchema } from "../../consts/zod-schemas";

const router = CreateTypedRouter()

router.post('/feedbacks', {
  schema: {
    summary: 'Create Feedback',
    tags: ['Feedbacks'],
    body: feedbackZodSchema.omit({ id: true }),
    response: {
      201: feedbackZodSchema,
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      })
    },
  },
}, async (req, res) => {
  const { clienteId, pacoteId, rating, comentario } = req.body

  const cliente = clientes.find((cliente) => cliente.id === clienteId)

  if (!cliente) {
    return res.status(400).send({
      success: false,
      message: 'Cliente não encontrado'
    })
  }

  const pacote = pacotes.find((pacote) => pacote.id === pacoteId)

  if (!pacote) {
    return res.status(400).send({
      success: false,
      message: 'Pacote não encontrado'
    })
  }

  const reserva = reservas.find((reserva) => (
    reserva.clienteId === clienteId &&
    reserva.pacoteId === pacoteId &&
    reserva.status === 'Concluída'
  ))

  if (!reserva) {
    return res.status(400).send({
      success: false,
      message: 'Esse cliente ainda não concluiu nenhuma reserva com esse pacote',
    })
  }

  const feedback = {
    id: randomUUID(),
    clienteId,
    pacoteId,
    rating,
    comentario,
  }

  feedbacks.push(feedback)

  return res.status(201).send({
    ...feedback,
  })
})

export const createFeedback = router