import request from 'supertest'
import app from '../../app'
import { ClienteSchema } from "../../models/cliente"
import { clienteFactory } from "../../tests/factories/cliente-factory"
import { enderecoFactory } from '../../tests/factories/endereco-factory'

describe('[POST] /enderecos', () => {
    let cliente: ClienteSchema
    let token = ''

    beforeEach(async () => {
        cliente = await clienteFactory({
            email: 'cliente@email.com',
            password: '123456'
        })

        const response = await request(app)
            .post('/login')
            .send({
                email: 'cliente@email.com',
                password: '123456'
            })
        
        token = response.body.token
    })

    it('deve retornar 201 e o endereço', async () => {
        await enderecoFactory({
            clienteId: cliente.id
        })

        const response = await request(app)
            .post('/enderecos')
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
        
        expect(response.status).toBe(201)
        expect(response.body).toEqual(expect.objectContaining({
            clienteId: cliente.id.toString(),
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
})