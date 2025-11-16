import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'

describe('[POST] /cliente', () => {

  it('deve retornar 201 e o cliente', async () => {
    const response = await request(app)
      .post('/clientes')
      .send({
        name: 'testeCliente',
        email: 'cliente@email.com',
        phone: '000000000',
        password: '123',
        role: 'Cliente',
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual(expect.objectContaining({
        name: 'testeCliente',
        email: 'cliente@email.com',
        phone:'000000000',
        role: 'Cliente',
    }))
  })

  it('deve retornar 400 quando um Cliente já possui esse email', async () => {
    const pacote = await clienteFactory({
      email: 'cliente1@email.com'
    })

    const response = await request(app)
      .post('/clientes')
      .send({
        name: 'testeCliente',
        email: 'cliente1@email.com',
        phone: '000000000',
        password: '123',
        role: 'Cliente',
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Cliente com esse email já existe'
    })
  })

  it('deve retornar 400 quando um cliente com esse número já existir', async () => {
    const cliente = await clienteFactory({
      phone: '000000000'
    })

    const response = await request(app)
      .post('/clientes')
      .send({
        name: 'testeCliente',
        email: 'cliente2@email.com',
        phone: '000000000',
        password: '123',
        role: 'Cliente',
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Cliente com esse telefone já existe'
    })
  })
})
