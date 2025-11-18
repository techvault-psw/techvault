import { CreateTypedRouter } from "express-zod-openapi-typed";
import z from "zod";
import { errorMessageSchema, objectIdSchema } from "../../consts/zod-schemas";
import { feedbacks } from "../../models/feedback";
import { authValidator } from "../../middlewares/auth";

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
      400: errorMessageSchema,
      403: errorMessageSchema
    },
  },
}, authValidator, async (req, res) => {
  const { id } = req.params
  const user = req.user!

  const feedback = await feedbacks.findById(id)

  if (!feedback) {
    return res.status(400).send({
      success: false,
      message: 'Feedback não encontrado'
    })
  }

  if (user.id !== feedback.clienteId.toString() && user.role !== 'Gerente') {
    return res.status(403).send({
      success: false,
      message: 'Acesso não autorizado'
    })
  }

  await feedbacks.findByIdAndDelete(id)

  return res.status(200).send({
    feedbackId: id,
  })
})

export const deleteFeedback = router