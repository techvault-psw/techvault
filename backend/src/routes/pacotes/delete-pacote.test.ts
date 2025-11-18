import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { pacoteFactory } from '../../tests/factories/pacote-factory'
import { Types } from 'mongoose'
import type { ClienteSchema } from '../../models/cliente'

describe('[DELETE] /pacote', () => {
  let cliente: ClienteSchema
  let token = ''

  beforeEach(async () => {
    cliente = await clienteFactory({
      email: 'admin@email.com',
      password: '123456',
      role: 'Gerente'
    })

    const response = await request(app)
      .post('/login')
      .send({
        email: 'admin@email.com',
        password: '123456',
      })

    token = response.body.token
  })

  it('deve retornar 200 e id do pacote', async () => {
    const pacote = await pacoteFactory()

    const response = await request(app)
      .delete(`/pacotes/${pacote.id.toString()}`)
      .auth(token, { type: 'bearer' })
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      pacoteId: pacote.id.toString()
    })
  })

  it('deve retornar 400 quando um pacote não é encontrado', async () => {
    const idPacoteInexistente = new Types.ObjectId()

    const response = await request(app)
      .delete(`/pacotes/${idPacoteInexistente}`)
      .auth(token, { type: 'bearer' })
      .send()

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Pacote não encontrado',
    })
  })
})
