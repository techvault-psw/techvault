import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { feedbackExtendedZodSchema } from "../../consts/zod-schemas";
import { feedbacks, type PopulatedFeedbackSchema } from "../../models/feedback";
import { PopulatedFeedbackFormatter } from "../../formatters/feedback-formatter";

const router = CreateTypedRouter()

router.get('/feedbacks', {
  schema: {
    summary: 'Get Feedbacks',
    tags: ['Feedbacks'],
    response: {
      200: z.array(feedbackExtendedZodSchema),
    },
  },
}, async (req, res) => {
  const dbFeedbacks = await feedbacks.find({}).populate("clienteId pacoteId") as PopulatedFeedbackSchema[]

  const formattedFeedbacks = dbFeedbacks
    .filter(f => f.clienteId && f.pacoteId)
    .map(PopulatedFeedbackFormatter)

  return res.status(200).send(formattedFeedbacks)
})

export const getFeedbacks = router