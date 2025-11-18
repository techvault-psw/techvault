import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { pacoteFactory } from '../../tests/factories/pacote-factory'
import { enderecoFactory } from '../../tests/factories/endereco-factory'
import { reservaFactory } from '../../tests/factories/reserva-factory'
import { Types } from 'mongoose'
import type { ClienteSchema } from '../../models/cliente'

describe('[DELETE] /reservas/:id', () => {
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

  it('deve retornar 200 e id da reserva', async () => {
    const pacote = await pacoteFactory()
    const endereco = await enderecoFactory({ clienteId: cliente.id })
    const reserva = await reservaFactory({
      clienteId: cliente.id,
      pacoteId: pacote.id,
      enderecoId: endereco.id,
    })

    const response = await request(app)
      .delete(`/reservas/${reserva.id.toString()}`)
      .auth(token, { type: 'bearer' })
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      reservaId: reserva.id.toString()
    })
  })

  it('deve retornar 400 quando uma reserva não é encontrada', async () => {
    const idReservaInexistente = new Types.ObjectId()

    const response = await request(app)
      .delete(`/reservas/${idReservaInexistente}`)
      .auth(token, { type: 'bearer' })
      .send()

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Reserva não encontrada',
    })
  })
})
