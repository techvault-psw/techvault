import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { pacoteFactory } from '../../tests/factories/pacote-factory'
import { feedbackFactory } from '../../tests/factories/feedback-factory'
import { Types } from 'mongoose'

describe('[GET] /feedbacks/:id', () => {
  it('deve retornar 200 e o feedback', async () => {
    const cliente = await clienteFactory()
    const pacote = await pacoteFactory()
    const feedback = await feedbackFactory({
      clienteId: cliente.id,
      pacoteId: pacote.id,
    })

    const response = await request(app)
      .get(`/feedbacks/${feedback.id.toString()}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({
      rating: feedback.rating,
      cliente: expect.objectContaining({
        id: cliente.id.toString(),
      }),
      pacote: expect.objectContaining({
        id: pacote.id.toString(),
      }),
    }))
  })

  it('deve retornar 400 quando o feedback não existe', async () => {
    const idFeedbackInexistente = new Types.ObjectId()

    const response = await request(app)
      .get(`/feedbacks/${idFeedbackInexistente}`)
      .send()

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Feedback não encontrado',
    })
  })
})
