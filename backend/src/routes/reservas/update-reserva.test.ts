import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { pacoteFactory } from '../../tests/factories/pacote-factory'
import { enderecoFactory } from '../../tests/factories/endereco-factory'
import { reservaFactory } from '../../tests/factories/reserva-factory'
import { Types } from 'mongoose'
import type { ClienteSchema } from '../../models/cliente'

describe('[PUT] /reservas/:id', () => {
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

  it('deve retornar 200 e reserva atualizada', async () => {
    const pacote = await pacoteFactory()
    const endereco = await enderecoFactory({ clienteId: cliente.id })
    const reserva = await reservaFactory({
      clienteId: cliente.id,
      pacoteId: pacote.id,
      enderecoId: endereco.id,
      codigoEntrega: 'ABC1234',
      codigoColeta: 'XYZ5678',
    })


    const response = await request(app)
      .put(`/reservas/${reserva.id.toString()}`)
      .auth(token, { type: 'bearer' })
      .send({
        dataInicio: '2025-12-01T10:00:00.000Z',
        dataTermino: '2025-12-08T10:00:00.000Z',
        status: 'Cancelada',
        codigoEntrega: 'ABC1234',
        codigoColeta: 'XYZ5678',
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({
      status: 'Cancelada',
    }))
  })

  it('deve retornar 400 quando uma reserva não é encontrada', async () => {
    const idReservaInexistente = new Types.ObjectId()

    const response = await request(app)
      .put(`/reservas/${idReservaInexistente}`)
      .auth(token, { type: 'bearer' })
      .send({
        dataInicio: '2025-12-01T10:00:00.000Z',
        dataTermino: '2025-12-08T10:00:00.000Z',
        status: 'Cancelada',
        codigoEntrega: 'ABC1234',
        codigoColeta: 'XYZ5678',
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Reserva não encontrada',
    })
  })
})
