import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { feedbacks } from "../../consts/db-mock";
import { feedbackZodSchema, objectIdSchema } from "../../consts/zod-schemas";

const router = CreateTypedRouter()

router.put('/feedbacks/:id', {
  schema: {
    summary: 'Update Feedback',
    tags: ['Feedbacks'],
    params: z.object({
      id: objectIdSchema,
    }),
    body: feedbackZodSchema.omit({
      id: true,
      clienteId: true,
      pacoteId: true,
    }),
    response: {
      200: feedbackZodSchema,
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
  },
}, async (req, res) => {
  const { id } = req.params
  const { rating, comentario } = req.body

  const feedbackIndex = feedbacks.findIndex((feedback) => feedback.id === id)

  if (feedbackIndex < 0) {
    return res.status(400).send({
      success: false,
      message: 'Feedback não encontrado'
    })
  }

  feedbacks[feedbackIndex].rating = rating
  feedbacks[feedbackIndex].comentario = comentario

  return res.status(200).send({
    ...feedbacks[feedbackIndex],
  })
})

export const updateFeedback = router