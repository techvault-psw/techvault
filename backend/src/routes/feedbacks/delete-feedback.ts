import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { objectIdSchema } from "../../consts/zod-schemas";
import { feedbacks } from "../../models/feedback";

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

  const feedback = await feedbacks.findById(id)

  if (!feedback) {
    return res.status(400).send({
      success: false,
      message: 'Feedback não encontrado'
    })
  }

  await feedbacks.findByIdAndDelete(id)

  return res.status(200).send({
    feedbackId: id,
  })
})

export const deleteFeedback = router