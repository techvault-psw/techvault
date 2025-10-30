import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { clientes, feedbacks, pacotes } from "../../consts/db-mock";
import type { FeedbackExtended } from "../../consts/types";
import { feedbackExtendedZodSchema } from "../../consts/zod-schemas";

const router = CreateTypedRouter()

router.get('/feedbacks', {
  schema: {
    summary: 'Get Feedbacks',
    tags: ['Feedbacks'],
    response: {
      200: z.object({
        feedbacks: z.array(feedbackExtendedZodSchema)
      }),
    },
  },
}, async (req, res) => {
  const extendedFeedbacks: FeedbackExtended[] = feedbacks.map((feedback) => {
    const cliente = clientes.find((cliente) => cliente.id === feedback.clienteId)
    const pacote = pacotes.find((pacote) => pacote.id === feedback.pacoteId)

    if (!cliente || !pacote) return undefined;
    
    return {
      ...feedback,
      cliente,
      pacote,
    }
  }).filter((f) => !!f)

  return res.status(200).send({
    feedbacks: extendedFeedbacks,
  })
})

export const getFeedbacks = router