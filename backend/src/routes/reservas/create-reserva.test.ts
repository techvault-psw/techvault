import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { enderecoFactory } from '../../tests/factories/endereco-factory'
import { pacoteFactory } from '../../tests/factories/pacote-factory'
import { ClienteSchema } from '../../models/cliente'
import { reservaFactory } from '../../tests/factories/reserva-factory'
import { Types } from 'mongoose'

describe('[POST] /reserva', () => {

  let cliente : ClienteSchema
  let token = ""

  beforeEach(async () => {
    cliente = await clienteFactory({
        email: 'cliente@email.com',
        password:'123456',
    })
    const response = await request(app)
      .post('/login')
      .send({
        email: 'cliente@email.com',
        password:'123456'
      })
    token = response.body.token
  })

  it('deve retornar 201 e a reserva', async () => {
    const endereco = await enderecoFactory({
        clienteId: cliente.id
    })
    const pacote = await pacoteFactory()
    const response = await request(app)
      .post('/reservas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        enderecoId: endereco.id.toString(),
        pacoteId: pacote.id.toString(),
        dataInicio: '2025-11-17T00:00:00.000Z',
        dataTermino: '2025-11-18T00:00:00.000Z',

      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual(expect.objectContaining({
        clienteId: cliente.id.toString(),
        enderecoId: endereco.id.toString(),
        pacoteId: pacote.id.toString(),
        dataInicio: '2025-11-17T00:00:00.000Z',
        dataTermino: '2025-11-18T00:00:00.000Z',

    }))
  })

  it('deve retornar 400 quando o pacote de uma reserva não é encontrado', async () => {
    const endereco = await enderecoFactory({
        clienteId: cliente.id
    })
    const response = await request(app)
      .post('/reservas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        enderecoId: endereco.id.toString(),
        pacoteId: '646f1c2b5f3c3b6a1c8e4d2f', // ID inválido
        dataInicio: '2025-11-17T00:00:00.000Z',
        dataTermino: '2025-11-18T00:00:00.000Z',
        
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Pacote não encontrado'
    })
  })
  it('deve retornar 400 quando o endereço de uma reserva não é encontrado', async () => {
    const pacote = await pacoteFactory()
    const endereco = await enderecoFactory({
      clienteId: cliente.id
    })  

    const response = await request(app)
      .post('/reservas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        enderecoId: new Types.ObjectId().toString(),
        pacoteId: pacote.id.toString(),
        dataInicio: '2025-11-17T00:00:00.000Z',
        dataTermino: '2025-11-18T00:00:00.000Z',
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Endereço não encontrado'
    })
  })



  it('deve retornar 400 quando a data de início for posterior à data de término', async () => {
    const pacote = await pacoteFactory()
    const endereco = await enderecoFactory({
        clienteId: cliente.id
    })
    const response = await request(app)
      .post('/reservas')
      .set('Authorization', `Bearer ${token}`)
      .send({
          enderecoId: endereco.id.toString(),
          pacoteId: pacote.id.toString(),
          dataInicio: '2025-11-20T00:00:00.000Z',
          dataTermino: '2025-11-18T00:00:00.000Z',
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'A data de início deve ser anterior à data de término',
    })
  })

  it('deve retornar 400 quando a duração da reserva for menor que 15 minutos', async () => {
    const pacote = await pacoteFactory()
    const endereco = await enderecoFactory({
        clienteId: cliente.id
    })
    const response = await request(app)
      .post('/reservas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        enderecoId: endereco.id.toString(),
        pacoteId: pacote.id.toString(),
        dataInicio: '2025-11-17T10:00:00.000Z',
        dataTermino: '2025-11-17T10:10:00.000Z',
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'A reserva deve ter duração mínima de 15 minutos',
    })
  })
})
