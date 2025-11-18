import request from 'supertest'
import app from '../../app'
import { clienteFactory } from "../../tests/factories/cliente-factory"
import { enderecoFactory } from "../../tests/factories/endereco-factory"
import { ClienteSchema } from '../../models/cliente'

describe('[GET] /enderecos', () => {
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

    it('deve retornar 200 e um array de endereços', async () => {
        const [cliente1, cliente2] = await Promise.all([
            clienteFactory(),
            clienteFactory()
        ])
        const [endereco1, endereco2] = await Promise.all([
            enderecoFactory({
                clienteId: cliente1.id
            }),
            enderecoFactory({
                clienteId: cliente2.id
            })
        ])
        
        const response = await request(app)
            .get('/enderecos')
            .auth(token, { type: 'bearer' })
            .send()
        expect(response.status).toBe(200)
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                cliente: expect.objectContaining({
                    id: cliente1.id.toString(),
                }),
                street: endereco1.street,
            }),
            expect.objectContaining({
                cliente: expect.objectContaining({
                    id: cliente2.id.toString(),
                }),
                street: endereco2.street,
            })
        ]))
    })
})