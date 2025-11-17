import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { enderecoFactory } from '../../tests/factories/endereco-factory'
import { pacoteFactory } from '../../tests/factories/pacote-factory'
import { reservaFactory } from '../../tests/factories/reserva-factory'
import { ClienteSchema } from '../../models/cliente'

describe('[GET] /reserva', () => {
  let cliente: ClienteSchema
  let gerente: ClienteSchema
  let suporte: ClienteSchema
  let tokenCliente = ""
  let tokenGerente = ""
  let tokenSuporte = ""

  beforeEach(async () => {
    cliente = await clienteFactory({
      email: 'cliente@email.com',
      password: '123456',
      role: 'Cliente'
    })
    gerente = await clienteFactory({
      email: 'admin@email.com',
      password: '123456',
      role: 'Gerente'
    })
    suporte = await clienteFactory({
      email: 'suporte@email.com',
      password: '123456',
      role: 'Suporte'
    })
    const responseCliente = await request(app)
      .post('/login')
      .send({
        email: 'cliente@email.com',
        password: '123456'
      })
    tokenCliente = responseCliente.body.token

    const responseGerente = await request(app)
      .post('/login')
      .send({
        email: 'admin@email.com',
        password: '123456'
      })
    tokenGerente = responseGerente.body.token

    const responseSuporte = await request(app)
      .post('/login')
      .send({
        email: 'suporte@email.com',
        password: '123456'
      })
    tokenSuporte = responseSuporte.body.token
  })
  
  it('deve retornar 200 e a reserva populada quando o cliente é o dono', async () => {
    const endereco = await enderecoFactory({
      clienteId: cliente.id
    })
    const pacote = await pacoteFactory()
    const reserva = await reservaFactory({
      clienteId: cliente.id,
      enderecoId: endereco.id,
      pacoteId: pacote.id,
      status: 'Confirmada'
    })
    const response = await request(app)
      .get(`/reservas/${reserva.id.toString()}`)
      .set('Authorization', `Bearer ${tokenCliente}`)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({
      id: reserva.id.toString(),
      status: 'Confirmada',
      clienteId: cliente.id.toString(),
      enderecoId: endereco.id.toString(),
      pacoteId: pacote.id.toString()
    }))
  })

  it('deve retornar 200 e a reserva quando o usuário é gerente', async () => {
    const endereco = await enderecoFactory({
      clienteId: cliente.id
    })
    const pacote = await pacoteFactory()
    const reserva = await reservaFactory({
      clienteId: cliente.id,
      enderecoId: endereco.id,
      pacoteId: pacote.id,
      status: 'Confirmada'
    })
    const response = await request(app)
      .get(`/reservas/${reserva.id.toString()}`)
      .set('Authorization', `Bearer ${tokenGerente}`)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({
      id: reserva.id.toString(),
      status: 'Confirmada'
    }))
  })

  it('deve retornar 200 e a reserva quando o usuário é suporte', async () => {  
    const endereco = await enderecoFactory({
      clienteId: cliente.id
    })
    const pacote = await pacoteFactory()
    const reserva = await reservaFactory({
      clienteId: cliente.id,
      enderecoId: endereco.id,
      pacoteId: pacote.id,
      status: 'Confirmada'
    })
    const response = await request(app)
      .get(`/reservas/${reserva.id.toString()}`)
      .set('Authorization', `Bearer ${tokenSuporte}`)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({
      id: reserva.id.toString(),
      status: 'Confirmada'
    }))
  })

  it('deve retornar 403 quando o cliente tenta acessar reserva de outro cliente', async () => {
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
      status: 'Confirmada'
    })
    const response = await request(app)
      .get(`/reservas/${reserva.id}`)
      .set('Authorization', `Bearer ${tokenCliente}`)
    expect(response.status).toBe(403)
    expect(response.body).toEqual({
      success: false,
      message: 'Acesso não autorizado.'
    })
  })

  it('deve retornar 400 quando a reserva não é encontrada', async () => {
    const response = await request(app)
      .get(`/reservas/646f1c2b5f3c3b6a1c8e4d2f`)
      .set('Authorization', `Bearer ${tokenCliente}`)
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Reserva não encontrada'
    })
  })

  
})