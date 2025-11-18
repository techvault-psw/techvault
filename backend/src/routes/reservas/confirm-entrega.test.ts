import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { pacoteFactory } from '../../tests/factories/pacote-factory'
import { enderecoFactory } from '../../tests/factories/endereco-factory'
import { reservaFactory } from '../../tests/factories/reserva-factory'
import { Types } from 'mongoose'
import type { ClienteSchema } from '../../models/cliente'

describe('[PATCH] /reservas/:id/confirmar-entrega', () => {
  let cliente: ClienteSchema
  let token = ''

  beforeEach(async () => {
    cliente = await clienteFactory({
      email: 'suporte@email.com',
      password: '123456',
      role: 'Suporte'
    })

    const response = await request(app)
      .post('/login')
      .send({
        email: 'suporte@email.com',
        password: '123456',
      })

    token = response.body.token
  })

  it('deve retornar 200 e confirmar a entrega da reserva', async () => {
    const pacote = await pacoteFactory()
    const endereco = await enderecoFactory({ clienteId: cliente.id })
    const reserva = await reservaFactory({
      clienteId: cliente.id,
      pacoteId: pacote.id,
      enderecoId: endereco.id,
      codigoEntrega: 'ABC1234',
    })

    const response = await request(app)
      .patch(`/reservas/${reserva.id.toString()}/confirmar-entrega`)
      .auth(token, { type: 'bearer' })
      .send({
        codigoEntrega: 'ABC1234',
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({
      id: reserva.id.toString(),
      dataEntrega: expect.any(String),
    }))
  })

  it('deve retornar 400 quando uma reserva não é encontrada', async () => {
    const idReservaInexistente = new Types.ObjectId()

    const response = await request(app)
      .patch(`/reservas/${idReservaInexistente}/confirmar-entrega`)
      .auth(token, { type: 'bearer' })
      .send({
        codigoEntrega: 'ABC1234',
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Reserva não encontrada',
    })
  })

  it('deve retornar 400 quando o código de entrega é inválido', async () => {
    const pacote = await pacoteFactory()
    const endereco = await enderecoFactory({ clienteId: cliente.id })
    const reserva = await reservaFactory({
      clienteId: cliente.id,
      pacoteId: pacote.id,
      enderecoId: endereco.id,
      codigoEntrega: 'ABC1234',
    })

    const response = await request(app)
      .patch(`/reservas/${reserva.id.toString()}/confirmar-entrega`)
      .auth(token, { type: 'bearer' })
      .send({
        codigoEntrega: 'WRONG12',
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Código de entrega inválido',
    })
  })

  it('deve retornar 400 quando já foi registrada a entrega', async () => {
    const pacote = await pacoteFactory()
    const endereco = await enderecoFactory({ clienteId: cliente.id })
    const reserva = await reservaFactory({
      clienteId: cliente.id,
      pacoteId: pacote.id,
      enderecoId: endereco.id,
      codigoEntrega: 'ABC1234',
      dataEntrega: new Date("2024-06-01T10:00:00.000Z").toISOString(),
    })

    const response = await request(app)
      .patch(`/reservas/${reserva.id.toString()}/confirmar-entrega`)
      .auth(token, { type: 'bearer' })
      .send({
        codigoEntrega: 'ABC1234',
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Já foi registrada a entrega para esta reserva',
    })
  })
})
