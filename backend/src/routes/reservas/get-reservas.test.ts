import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { pacoteFactory } from '../../tests/factories/pacote-factory'
import { enderecoFactory } from '../../tests/factories/endereco-factory'
import { reservaFactory } from '../../tests/factories/reserva-factory'
import type { ClienteSchema } from '../../models/cliente'

describe('[GET] /reservas', () => {
  let cliente: ClienteSchema
  let token = ''

  beforeEach(async () => {
    cliente = await clienteFactory({
      email: 'user@email.com',
      password: '123456',
    })

    const response = await request(app)
      .post('/login')
      .send({
        email: 'user@email.com',
        password: '123456',
      })

    token = response.body.token
  })

  it('deve retornar 200 e um array de reservas', async () => {
    const pacote = await pacoteFactory()
    const endereco = await enderecoFactory({ clienteId: cliente.id })

    const [reserva1, reserva2] = await Promise.all([
      reservaFactory({
        clienteId: cliente.id,
        pacoteId: pacote.id,
        enderecoId: endereco.id,
        status: 'Confirmada',
      }),
      reservaFactory({
        clienteId: cliente.id,
        pacoteId: pacote.id,
        enderecoId: endereco.id,
        status: 'Confirmada',
      })
    ])

    const response = await request(app)
      .get('/reservas')
      .auth(token, { type: 'bearer' })
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: reserva1.id.toString(),
        status: reserva1.status,
      }),
      expect.objectContaining({
        id: reserva2.id.toString(),
        status: reserva2.status,
      }),
    ]))
  })
})
