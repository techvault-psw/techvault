import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { pacoteFactory } from '../../tests/factories/pacote-factory'
import { feedbackFactory } from '../../tests/factories/feedback-factory'
import { Types } from 'mongoose'
import { reservaFactory } from '../../tests/factories/reserva-factory'
import { enderecoFactory } from '../../tests/factories/endereco-factory'
import type { ClienteSchema } from '../../models/cliente'

describe('[POST] /feedbacks', () => {
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

  it('deve retornar 201 e o feedback', async () => {
    const pacote = await pacoteFactory()
    const endereco = await enderecoFactory({
      clienteId: cliente.id,
    })
    await reservaFactory({
      clienteId: cliente.id,
      pacoteId: pacote.id,
      enderecoId: endereco.id,
      status: 'Concluída',
    })

    const response = await request(app)
      .post('/feedbacks')
      .auth(token, { type: 'bearer' })
      .send({
        pacoteId: pacote.id.toString(),
        rating: 5,
        comentario: 'Comentário do feedback'
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual(expect.objectContaining({
      clienteId: cliente.id.toString(),
      pacoteId: pacote.id.toString(),
      rating: 5,
      comentario: 'Comentário do feedback',
    }))
  })

  it('deve retornar 400 quando o pacote não existe', async () => {
    const response = await request(app)
      .post('/feedbacks')
      .auth(token, { type: 'bearer' })
      .send({
        pacoteId: new Types.ObjectId(),
        rating: 5,
        comentario: 'Comentário do feedback'
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Pacote não encontrado'
    })
  })

  it('deve retornar 400 quando o cliente não concluiu nenhuma reserva com aquele pacote', async () => {
    const pacote = await pacoteFactory()

    const response = await request(app)
      .post('/feedbacks')
      .auth(token, { type: 'bearer' })
      .send({
        pacoteId: pacote.id.toString(),
        rating: 5,
        comentario: 'Comentário do feedback'
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Esse cliente ainda não concluiu nenhuma reserva com esse pacote'
    })
  })
})
