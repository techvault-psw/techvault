import request from 'supertest'
import app from '../../app'
import { ClienteSchema } from "../../models/cliente"
import { clienteFactory } from "../../tests/factories/cliente-factory"
import { enderecoFactory } from '../../tests/factories/endereco-factory'
import { Types } from 'mongoose'

describe('[PUT] /enderecos/:id', () => {
    let cliente: ClienteSchema
    let token = ''

    beforeEach(async () => {
        cliente = await clienteFactory({
            email: 'cliente@email.com',
            password: '123456',
        })

        const response = await request(app)
        .post('/login')
        .send({
            email: 'cliente@email.com',
            password: '123456',
        })

        token = response.body.token
    })

    it('deve retornar 200 e o endereço atualizado', async () => {
        const endereco = await enderecoFactory({
            clienteId: cliente.id
        })

        const response = await request(app)
            .put(`/enderecos/${endereco.id.toString()}`)
            .auth(token, { type: 'bearer' })
            .send({
                name: "Casa Principal",
                cep: "12345-678",
                street: "Rua das Flores",
                number: "123",
                description: "Portão azul",
                neighborhood: "Centro",
                city: "São Paulo",
                state: "SP"
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual(expect.objectContaining({
            name: "Casa Principal",
            cep: "12345-678",
            street: "Rua das Flores",
            number: "123",
            description: "Portão azul",
            neighborhood: "Centro",
            city: "São Paulo",
            state: "SP"
        }))
    })

    it('deve retornar 400 quando o endereço não existe', async () => {
        const idEnderecoInexistente = new Types.ObjectId()

        const response = await request(app)
            .put(`/enderecos/${idEnderecoInexistente}`)
            .auth(token, { type: 'bearer' })
            .send({
                name: "Casa Principal",
                cep: "12345-678",
                street: "Rua das Flores",
                number: "123",
                description: "Portão azul",
                neighborhood: "Centro",
                city: "São Paulo",
                state: "SP"
            })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            success: false,
            message: 'Endereço não encontrado'
        })
    })

    it('deve retornar 403 quando o endereço não é do cliente e ele não é o gerente', async () => {
        const cliente2 = await clienteFactory()
        const endereco = await enderecoFactory({
            clienteId: cliente2.id
        })

        const response = await request(app)
            .put(`/enderecos/${endereco.id.toString()}`)
            .auth(token, { type: 'bearer' })
            .send({
                name: "Casa Principal",
                cep: "12345-678",
                street: "Rua das Flores",
                number: "123",
                description: "Portão azul",
                neighborhood: "Centro",
                city: "São Paulo",
                state: "SP"
            })

        expect(response.status).toBe(403)
        expect(response.body).toEqual({
            success: false,
            message: 'Acesso não autorizado',
        })
    })
})