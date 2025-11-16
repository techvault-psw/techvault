import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { Types } from 'mongoose'
import type { ClienteSchema } from '../../models/cliente'

describe('[DELETE] /cliente', () => {
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

  it('deve retornar 200 e id do Cliente', async () => {

    const response = await request(app)
      .delete(`/clientes/${cliente.id.toString()}`)
      .auth(token, { type: 'bearer' })
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      clienteId: cliente.id.toString()
    })
  })

  it('deve retornar 400 quando um Cliente não é encontrado', async () => {
    const idClienteInexistente = new Types.ObjectId()

    const response = await request(app)
      .delete(`/clientes/${idClienteInexistente}`)
      .auth(token, { type: 'bearer' })
      .send()

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Cliente não encontrado',
    })
  })

    it('deve retornar 403 quando um Cliente não é autorizado', async () => {
    const cliente2 = await clienteFactory()
    const response = await request(app)

      .delete(`/clientes/${cliente2.id.toString()}`)
      .auth(token, { type: 'bearer' })
      .send()

    expect(response.status).toBe(403)
    expect(response.body).toEqual({
      success: false,
      message: 'Acesso não autorizado',
    })
  })
})
