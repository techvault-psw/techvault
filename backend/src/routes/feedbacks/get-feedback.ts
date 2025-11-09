import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { feedbackExtendedZodSchema, objectIdSchema } from "../../consts/zod-schemas";
import { feedbacks, type PopulatedFeedbackSchema } from "../../models/feedback";
import { PopulatedFeedbackFormatter } from "../../formatters/feedback-formatter";

const router = CreateTypedRouter()

router.get('/feedbacks/:id', {
  schema: {
    summary: 'Get Feedback',
    tags: ['Feedbacks'],
    params: z.object({
      id: objectIdSchema,
    }),
    response: {
      200: feedbackExtendedZodSchema,
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
  },
}, async (req, res) => {
  const { id } = req.params

  const feedback = await feedbacks.findById(id).populate("clienteId pacoteId") as PopulatedFeedbackSchema

  if (!feedback) {
    return res.status(400).send({
      success: false,
      message: 'Feedback não encontrado'
    })
  }

  const formattedFeedback = PopulatedFeedbackFormatter(feedback)

  return res.status(200).send(formattedFeedback)
})

export const getFeedback = router