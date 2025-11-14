import { Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import { feedbacks, type FeedbackSchema } from '../../models/feedback'
import type { Feedback } from '../../consts/types'

export type FeedbackFactoryParams = Partial<Omit<Feedback, 'id'>> & {
  clienteId: Types.ObjectId
  pacoteId: Types.ObjectId
}

export const feedbackFactory = async (params: FeedbackFactoryParams): Promise<FeedbackSchema> => {
  if (!params.clienteId) {
    throw new Error('clienteId é obrigatório para criar um feedback')
  }
  if (!params.pacoteId) {
    throw new Error('pacoteId é obrigatório para criar um feedback')
  }

  return await feedbacks.create({
    clienteId: params.clienteId,
    pacoteId: params.pacoteId,
    rating: params.rating ?? faker.number.int({ min: 1, max: 5 }),
    comentario: params.comentario ?? faker.lorem.sentence(15),
  })
}
