import request from 'supertest'
import app from '../../app'
import { Types } from 'mongoose'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { ClienteSchema } from '../../models/cliente'

describe('[GET] /cliente/:id', () => {

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

  it('deve retornar 200 e o cliente', async () => {

    const response = await request(app)
      .get(`/clientes/${cliente.id.toString()}`)
      .auth(token, { type: 'bearer' })
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({
      email: cliente.email,
      role: cliente.role,
    }))
  })

  it('deve retornar 400 quando o cliente não existe', async () => {
    const idClienteInexistente = new Types.ObjectId()

    const response = await request(app)
      .get(`/Clientes/${idClienteInexistente}`)
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

      .get(`/clientes/${cliente2.id.toString()}`)
      .auth(token, { type: 'bearer' })
      .send()

    expect(response.status).toBe(403)
    expect(response.body).toEqual({
      success: false,
      message: 'Acesso não autorizado',
    })
  })

})
