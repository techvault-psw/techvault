import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { pacoteFactory } from '../../tests/factories/pacote-factory'
import { enderecoFactory } from '../../tests/factories/endereco-factory'
import { reservaFactory } from '../../tests/factories/reserva-factory'
import { Types } from 'mongoose'
import type { ClienteSchema } from '../../models/cliente'

describe('[PATCH] /reservas/:id/confirmar-coleta', () => {
  let cliente: ClienteSchema
  let token = ''

  beforeEach(async () => {
    cliente = await clienteFactory({
      email: 'gerente@email.com',
      password: '123456',
      role: 'Gerente'
    })

    const response = await request(app)
      .post('/login')
      .send({
        email: 'gerente@email.com',
        password: '123456',
      })

    token = response.body.token
  })

  it('deve retornar 200 e confirmar a coleta da reserva', async () => {
    const pacote = await pacoteFactory()
    const endereco = await enderecoFactory({ clienteId: cliente.id })
    const reserva = await reservaFactory({
      clienteId: cliente.id,
      pacoteId: pacote.id,
      enderecoId: endereco.id,
      codigoColeta: 'XYZ9876',
      dataEntrega: new Date("2024-06-01T10:00:00.000Z").toISOString(),
    })

    const response = await request(app)
      .patch(`/reservas/${reserva.id.toString()}/confirmar-coleta`)
      .auth(token, { type: 'bearer' })
      .send({
        codigoColeta: 'XYZ9876',
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({
      id: reserva.id.toString(),
      dataColeta: expect.any(String),
      status: 'Concluída',
    }))
  })

  it('deve retornar 400 quando uma reserva não é encontrada', async () => {
    const idReservaInexistente = new Types.ObjectId()

    const response = await request(app)
      .patch(`/reservas/${idReservaInexistente}/confirmar-coleta`)
      .auth(token, { type: 'bearer' })
      .send({
        codigoColeta: 'XYZ9876',
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Reserva não encontrada',
    })
  })

  it('deve retornar 400 quando o código de coleta é inválido', async () => {
    const pacote = await pacoteFactory()
    const endereco = await enderecoFactory({ clienteId: cliente.id })
    const reserva = await reservaFactory({
      clienteId: cliente.id,
      pacoteId: pacote.id,
      enderecoId: endereco.id,
      codigoColeta: 'XYZ9876',
      dataEntrega: new Date("2024-06-01T10:00:00.000Z").toISOString(),
    })

    const response = await request(app)
      .patch(`/reservas/${reserva.id.toString()}/confirmar-coleta`)
      .auth(token, { type: 'bearer' })
      .send({
        codigoColeta: 'WRONG99',
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Código de coleta inválido',
    })
  })

  it('deve retornar 400 quando a entrega ainda não foi registrada', async () => {
    const pacote = await pacoteFactory()
    const endereco = await enderecoFactory({ clienteId: cliente.id })
    const reserva = await reservaFactory({
      clienteId: cliente.id,
      pacoteId: pacote.id,
      enderecoId: endereco.id,
      codigoColeta: 'XYZ9876',
    })

    const response = await request(app)
      .patch(`/reservas/${reserva.id.toString()}/confirmar-coleta`)
      .auth(token, { type: 'bearer' })
      .send({
        codigoColeta: 'XYZ9876',
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Ainda não foi registrada a entrega desta reserva',
    })
  })

  it('deve retornar 400 quando já foi registrada a coleta', async () => {
    const pacote = await pacoteFactory()
    const endereco = await enderecoFactory({ clienteId: cliente.id })
    const reserva = await reservaFactory({
      clienteId: cliente.id,
      pacoteId: pacote.id,
      enderecoId: endereco.id,
      codigoColeta: 'XYZ9876',
      dataEntrega: new Date("2024-06-01T10:00:00.000Z").toISOString(),
      dataColeta: new Date("2024-06-02T10:00:00.000Z").toISOString(),
      status: 'Concluída',
    })

    const response = await request(app)
      .patch(`/reservas/${reserva.id.toString()}/confirmar-coleta`)
      .auth(token, { type: 'bearer' })
      .send({
        codigoColeta: 'XYZ9876',
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Já foi registrada a coleta para esta reserva',
    })
  })
})
