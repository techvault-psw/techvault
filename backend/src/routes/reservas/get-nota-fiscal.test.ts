import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { enderecoFactory } from '../../tests/factories/endereco-factory'
import { pacoteFactory } from '../../tests/factories/pacote-factory'
import { reservaFactory } from '../../tests/factories/reserva-factory'
import { ClienteSchema } from '../../models/cliente'
import { Types } from 'mongoose'

describe('[GET] /reservas/:id/nota-fiscal', () => {
  let cliente: ClienteSchema
  let token = ""

  beforeEach(async () => {
    cliente = await clienteFactory({
      email: 'cliente@email.com',
      password: '123456',
      role: 'Cliente'
    })

    const response = await request(app)
      .post('/login')
      .send({
        email: 'cliente@email.com',
        password: '123456'
      })

    token = response.body.token
  })
  
  it('deve retornar 200 e o PDF da nota fiscal', async () => {
    const endereco = await enderecoFactory({
      clienteId: cliente.id
    })
    const pacote = await pacoteFactory()
    const reserva = await reservaFactory({
      clienteId: cliente.id,
      enderecoId: endereco.id,
      pacoteId: pacote.id,
      status: 'Concluída'
    })
    const response = await request(app)
      .get(`/reservas/${reserva.id.toString()}/nota-fiscal`)
      .auth(token, { type: 'bearer' })
    
    expect(response.status).toBe(200)
    expect(response.header['content-type']).toBe('application/pdf')
    expect(response.header['content-disposition']).toContain(`attachment; filename=nota-fiscal-${reserva._id}.pdf`)
  })

  it('deve retornar 403 quando o cliente tenta acessar nota fiscal de outro cliente', async () => {
    const outroCliente = await clienteFactory({
      email: 'outrocliente@email.com',
      password: '123456',
      role: 'Cliente'
    })
    const endereco = await enderecoFactory({
      clienteId: outroCliente.id
    })
    const pacote = await pacoteFactory()
    const reserva = await reservaFactory({
      clienteId: outroCliente.id,
      enderecoId: endereco.id,
      pacoteId: pacote.id,
      status: 'Concluída'
    })

    const response = await request(app)
      .get(`/reservas/${reserva.id.toString()}/nota-fiscal`)
      .auth(token, { type: 'bearer' })
    
    expect(response.status).toBe(403)
    expect(response.body).toEqual({
      success: false,
      message: 'Acesso não autorizado.'
    })
  })

  it('deve retornar 400 quando a reserva não é encontrada', async () => {
    const response = await request(app)
      .get(`/reservas/${(new Types.ObjectId).toString()}/nota-fiscal`)
      .auth(token, { type: 'bearer' })
    
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Reserva não encontrada'
    })
  })
})
