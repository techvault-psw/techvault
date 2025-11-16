import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { Types } from 'mongoose'
import type { ClienteSchema } from '../../models/cliente'

describe('[PUT] /clientes', () => {
  let cliente: ClienteSchema
  let token = ''

  beforeEach(async () => {
    cliente = await clienteFactory({
      email: 'admin@email.com',
      password: '123456',
      role: 'Cliente'
    })

    const response = await request(app)
      .post('/login')
      .send({
        email: 'admin@email.com',
        password: '123456',
      })

    token = response.body.token
  })

  it('deve retornar 200 e cliente atualizado', async () => {

    const response = await request(app)
      .put(`/clientes/${cliente.id.toString()}`)
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Cliente Atualizado',
        email: 'cliente@email.com',
        phone: '000000000',
        password: '123',
        role: 'Cliente',
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({
      name: 'Cliente Atualizado',
    }))
  })

  it('deve retornar 400 quando um cliente não é encontrado', async () => {
    const idClienteInexistente = new Types.ObjectId()

    const response = await request(app)
      .put(`/clientes/${idClienteInexistente}`)
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Cliente Atualizado',
        email: 'cliente@email.com',
        phone: '000000000',
        password: '123',
        role: 'Cliente',
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Cliente não encontrado',
    })
  })
    it('deve retornar 403 quando um Cliente não é autorizado', async () => {
    const cliente2 = await clienteFactory()
    const response = await request(app)

      .put(`/clientes/${cliente2.id.toString()}`)
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Cliente Atualizado',
        email: 'cliente@email.com',
        phone: '000000000',
        password: '123',
        role: 'Cliente',
    })

        expect(response.status).toBe(403)
        expect(response.body).toEqual({
        success: false,
        message: 'Acesso não autorizado',
    })
  })
})
