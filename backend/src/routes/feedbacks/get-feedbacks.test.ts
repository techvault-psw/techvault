import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { pacoteFactory } from '../../tests/factories/pacote-factory'
import { feedbackFactory } from '../../tests/factories/feedback-factory'

describe('[GET] /feedbacks', () => {
  it('deve retornar 200 e um array de feedbacks', async () => {
    const [cliente1, cliente2, pacote1, pacote2] = await Promise.all([
      clienteFactory(),
      clienteFactory(),
      pacoteFactory(),
      pacoteFactory(),
    ])
    const [feedback1, feedback2] = await Promise.all([
      feedbackFactory({
        clienteId: cliente1.id,
        pacoteId: pacote1.id,
      }),
      feedbackFactory({
        clienteId: cliente2.id,
        pacoteId: pacote2.id,
      })
    ])

    const response = await request(app)
      .get('/feedbacks')
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        rating: feedback1.rating,
        cliente: expect.objectContaining({
          id: cliente1.id.toString(),
        }),
        pacote: expect.objectContaining({
          id: pacote1.id.toString(),
        }),
      }),
      expect.objectContaining({
        rating: feedback2.rating,
        cliente: expect.objectContaining({
          id: cliente2.id.toString(),
        }),
        pacote: expect.objectContaining({
          id: pacote2.id.toString(),
        }),
      }),
    ]))
  })
})
