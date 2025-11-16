import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { pacoteFactory } from '../../tests/factories/pacote-factory'
import { Types } from 'mongoose'
import type { ClienteSchema } from '../../models/cliente'
import { compare } from 'bcrypt'

describe('[PUT] /pacote', () => {
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

  it('deve retornar 200 e pacote atualizado', async () => {
    const pacote = await pacoteFactory()

    const response = await request(app)
      .put(`/pacotes/${pacote.id.toString()}`)
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Pacote Atualizado',
        image: 'https://i.ibb.co/d40k04kZ/setup-5.png',
        description: ['Descrição do pacote'],
        components: ['Componente', 'Componente'],
        value: 100,
        quantity: 10
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({
      name: 'Pacote Atualizado',
    }))
  })

  it('deve retornar 400 quando um pacote não é encontrado', async () => {
    const idPacoteInexistente = new Types.ObjectId()

    const response = await request(app)
      .put(`/pacotes/${idPacoteInexistente}`)
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Pacote Atualizado',
        image: 'https://i.ibb.co/d40k04kZ/setup-5.png',
        description: ['Descrição do pacote'],
        components: ['Componente', 'Componente'],
        value: 100,
        quantity: 10
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Pacote não encontrado',
    })
  })
})
