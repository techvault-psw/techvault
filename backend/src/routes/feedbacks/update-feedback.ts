import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { feedbackZodSchema, objectIdSchema } from "../../consts/zod-schemas";
import { feedbacks } from "../../models/feedback";
import { FeedbackFormatter } from "../../formatters/feedback-formatter";

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

  const feedback = await feedbacks.findById(id)

  if (!feedback) {
    return res.status(400).send({
      success: false,
      message: 'Feedback não encontrado'
    })
  }

  const updatedFeedback = await feedbacks.findByIdAndUpdate(
    id,
    { rating, comentario },
    { new: true }
  )

  const formattedFeedback = FeedbackFormatter(updatedFeedback!)

  return res.status(200).send(formattedFeedback)
})

export const updateFeedback = router