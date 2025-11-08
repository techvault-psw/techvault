import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { feedbacks } from "../../consts/db-mock";
import { objectIdSchema } from "../../consts/zod-schemas";

const router = CreateTypedRouter()

router.delete('/feedbacks/:id', {
  schema: {
    summary: 'Delete Feedback',
    tags: ['Feedbacks'],
    params: z.object({
      id: objectIdSchema,
    }),
    response: {
      200: z.object({
        feedbackId: objectIdSchema,
      }),
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
  },
}, async (req, res) => {
  const { id } = req.params

  const feedbackIndex = feedbacks.findIndex((feedback) => feedback.id === id)

  if (feedbackIndex < 0) {
    return res.status(400).send({
      success: false,
      message: 'Feedback não encontrado'
    })
  }

  feedbacks.splice(feedbackIndex, 1)

  return res.status(200).send({
    feedbackId: id,
  })
})

export const deleteFeedback = router