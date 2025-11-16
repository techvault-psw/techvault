import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { pacoteFactory } from '../../tests/factories/pacote-factory'
import type { ClienteSchema } from '../../models/cliente'

describe('[POST] /pacote', () => {
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

  it('deve retornar 201 e o pacote', async () => {
    const response = await request(app)
      .post('/pacotes')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'testePacote',
        image: 'https://i.ibb.co/d40k04kZ/setup-5.png',
        description: ['Descrição do pacote'],
        components: ['Componente', 'Componente'],
        value: 100,
        quantity: 10
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual(expect.objectContaining({
      name: 'testePacote',
      image: 'https://i.ibb.co/d40k04kZ/setup-5.png',
      description: ['Descrição do pacote'],
      components: ['Componente', 'Componente'],
      value: 100,
      quantity: 10
    }))
  })

  it('deve retornar 400 quando um pacote já possui esse nome', async () => {
    const pacote = await pacoteFactory({
      name: 'testePacote'
    })

    const response = await request(app)
      .post('/pacotes')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'testePacote',
        image: 'https://i.ibb.co/d40k04kZ/setup-5.png',
        description: ['Descrição do pacote'],
        components: ['Componente', 'Componente'],
        value: 100,
        quantity: 10
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Pacote com esse nome já existe'
    })
  })

  it('deve retornar 400 quando um pacote com essa imagem já existir', async () => {
    const pacote = await pacoteFactory({
      image: 'https://i.ibb.co/d40k04kZ/setup-5.png'
    })

    const response = await request(app)
      .post('/pacotes')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'testePacote',
        image: 'https://i.ibb.co/d40k04kZ/setup-5.png',
        description: ['Descrição do pacote'],
        components: ['Componente', 'Componente'],
        value: 100,
        quantity: 10
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Pacote com essa imagem já existe'
    })
  })
})
