import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { pacoteFactory } from '../../tests/factories/pacote-factory'
import { feedbackFactory } from '../../tests/factories/feedback-factory'
import { Types } from 'mongoose'
import type { ClienteSchema } from '../../models/cliente'

describe('[PUT] /feedbacks/:id', () => {
  let cliente: ClienteSchema
  let token = ''

  beforeEach(async () => {
    cliente = await clienteFactory({
      email: 'cliente@email.com',
      password: '123456',
    })

    const response = await request(app)
      .post('/login')
      .send({
        email: 'cliente@email.com',
        password: '123456',
      })

    token = response.body.token
  })

  it('deve retornar 200 e o feedback atualizado', async () => {
    const pacote = await pacoteFactory()
    const feedback = await feedbackFactory({
      clienteId: cliente.id,
      pacoteId: pacote.id,
    })

    const response = await request(app)
      .put(`/feedbacks/${feedback.id.toString()}`)
      .auth(token, { type: 'bearer' })
      .send({ 
        rating: 4,
        comentario: 'Comentário atualizado',
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({
        rating: 4,
        comentario: 'Comentário atualizado',
    }))
  })

  it('deve retornar 400 quando o feedback não existe', async () => {
    const idFeedbackInexistente = new Types.ObjectId()

    const response = await request(app)
      .put(`/feedbacks/${idFeedbackInexistente}`)
      .auth(token, { type: 'bearer' })
      .send({ 
        rating: 4,
        comentario: 'Comentário atualizado',
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Feedback não encontrado',
    })
  })

  it('deve retornar 403 quando o feedback não é do cliente e ele não é o gerente', async () => {
    const cliente2 = await clienteFactory()
    const pacote = await pacoteFactory()
    const feedback = await feedbackFactory({
      clienteId: cliente2.id,
      pacoteId: pacote.id,
    })

    const response = await request(app)
      .put(`/feedbacks/${feedback.id.toString()}`)
      .auth(token, { type: 'bearer' })
      .send({ 
        rating: 4,
        comentario: 'Comentário atualizado',
      })

    expect(response.status).toBe(403)
    expect(response.body).toEqual({
      success: false,
      message: 'Acesso não autorizado',
    })
  })
})
