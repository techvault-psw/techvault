import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { enderecoFactory } from '../../tests/factories/endereco-factory'
import { pacoteFactory } from '../../tests/factories/pacote-factory'
import { reservaFactory } from '../../tests/factories/reserva-factory'
import { ClienteSchema } from '../../models/cliente'

describe('[PATCH] /reserva', () => {
  let cliente : ClienteSchema
  let gerente: ClienteSchema
  let tokenCliente = ""
  let tokenGerente = ""

  beforeEach(async () => {
    cliente = await clienteFactory({
      email: 'cliente@email.com',
      password:'123456',
      role: 'Cliente'
    })
    gerente = await clienteFactory({
      email: 'admin@email.com',
      password:'123456',
      role: 'Gerente'
    })
    const responseCliente = await request(app)
    .post('/login')
    .send({
      email: 'cliente@email.com',
      password:'123456'
    })
      tokenCliente = responseCliente.body.token
    
    const responseGerente = await request(app)
    .post('/login')
    .send({
      email: 'admin@email.com',
      password:'123456'
    })
      tokenGerente = responseGerente.body.token
  })
  
	it('deve retornar 200 e cancelar a reserva quando o cliente é o dono', async () => {
		const endereco = await enderecoFactory({
			clienteId: cliente.id
		})
		const pacote = await pacoteFactory()
		const reserva = await reservaFactory({
			clienteId: cliente.id,
			enderecoId: endereco.id,
			pacoteId: pacote.id,
			status: 'Confirmada',
			dataColeta: undefined,
			dataEntrega: undefined
		})
		const response = await request(app)
			.patch(`/reservas/${reserva.id}/cancelar-reserva`)
			.set('Authorization', `Bearer ${tokenCliente}`)
		expect(response.status).toBe(200)
		expect(response.body).toEqual(expect.objectContaining({
			id: reserva.id,
			status: 'Cancelada'
		}))
	})

	it('deve retornar 200 e cancelar a reserva quando o usuário é gerente', async () => {
		const endereco = await enderecoFactory({
			clienteId: cliente.id
		})
		const pacote = await pacoteFactory()
		const reserva = await reservaFactory({
			clienteId: cliente.id,
			enderecoId: endereco.id,
			pacoteId: pacote.id,
			status: 'Confirmada',
			dataColeta: undefined,
			dataEntrega: undefined
		})
		const response = await request(app)
			.patch(`/reservas/${reserva.id}/cancelar-reserva`)
			.set('Authorization', `Bearer ${tokenGerente}`)
		expect(response.status).toBe(200)
		expect(response.body).toEqual(expect.objectContaining({
			id: reserva.id,
			status: 'Cancelada'
		}))
	})

	it('deve retornar 403 quando o usuário não é dono nem gerente', async () => {
		const outroCliente = await clienteFactory({
			email: 'outrocliente@email.com',
			password:'123456',
			role: 'Cliente'
		})
		const responseOutroCliente = await request(app)
			.post('/login')
			.send({
				email: 'outrocliente@email.com',
				password:'123456'
			})
		const endereco = await enderecoFactory({
			clienteId: cliente.id
		})
		const pacote = await pacoteFactory()
		const reserva = await reservaFactory({
			clienteId: cliente.id,
			enderecoId: endereco.id,
			pacoteId: pacote.id,
			status: 'Confirmada',
			dataColeta: undefined,
			dataEntrega: undefined
		})
		const response = await request(app)
			.patch(`/reservas/${reserva.id}/cancelar-reserva`)
			.set('Authorization', `Bearer ${responseOutroCliente.body.token}`)
		expect(response.status).toBe(403)
		expect(response.body).toEqual({
			success: false,
			message: 'Acesso não autorizado.'
		})
	})

	it('deve retornar 400 quando a reserva não é encontrada', async () => {
		const response = await request(app)
			.patch(`/reservas/646f1c2b5f3c3b6a1c8e4d2f/cancelar-reserva`)
			.set('Authorization', `Bearer ${tokenCliente}`)
		expect(response.status).toBe(400)
		expect(response.body).toEqual({
			success: false,
			message: 'Reserva não encontrada'
		})
	})

	it('deve retornar 400 quando a reserva já tem data de entrega', async () => {
		const endereco = await enderecoFactory({
			clienteId: cliente.id
		})
		const pacote = await pacoteFactory()
		const reserva = await reservaFactory({
			clienteId: cliente.id,
			enderecoId: endereco.id,
			pacoteId: pacote.id,
			status: 'Confirmada',
			dataColeta: undefined,
			dataEntrega: new Date().toISOString()
		})
		const response = await request(app)
			.patch(`/reservas/${reserva.id}/cancelar-reserva`)
			.set('Authorization', `Bearer ${tokenCliente}`)
		expect(response.status).toBe(400)
		expect(response.body).toEqual({
			success: false,
			message: 'Essa reserva não pode ser cancelada.'
		})
	})

	it('deve retornar 400 quando a reserva já tem data de coleta', async () => {
		const endereco = await enderecoFactory({
			clienteId: cliente.id
		})
		const pacote = await pacoteFactory()
		const reserva = await reservaFactory({
			clienteId: cliente.id,
			enderecoId: endereco.id,
			pacoteId: pacote.id,
			status: 'Confirmada',
			dataColeta: new Date().toISOString(),
			dataEntrega: undefined
		})
		const response = await request(app)
			.patch(`/reservas/${reserva.id}/cancelar-reserva`)
			.set('Authorization', `Bearer ${tokenCliente}`)
		expect(response.status).toBe(400)
		expect(response.body).toEqual({
			success: false,
			message: 'Essa reserva não pode ser cancelada.'
		})
	})

	it('deve retornar 400 quando a reserva já está concluída', async () => {
		const endereco = await enderecoFactory({
			clienteId: cliente.id
		})
		const pacote = await pacoteFactory()
		const reserva = await reservaFactory({
			clienteId: cliente.id,
			enderecoId: endereco.id,
			pacoteId: pacote.id,
			status: 'Concluída',
			dataColeta: new Date().toISOString(),
			dataEntrega: new Date().toISOString()
		})
		const response = await request(app)
			.patch(`/reservas/${reserva.id}/cancelar-reserva`)
			.set('Authorization', `Bearer ${tokenCliente}`)
		expect(response.status).toBe(400)
		expect(response.body).toEqual({
			success: false,
			message: 'Essa reserva não pode ser cancelada.'
		})
	})



})