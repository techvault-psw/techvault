import request from 'supertest'
import app from '../../app'
import { ClienteSchema } from "../../models/cliente"
import { clienteFactory } from "../../tests/factories/cliente-factory"
import { pacoteFactory } from '../../tests/factories/pacote-factory'
import { reservaFactory } from '../../tests/factories/reserva-factory'
import { enderecoFactory } from '../../tests/factories/endereco-factory'

describe('[GET] /relatorios/reservas', () => {
    let cliente: ClienteSchema
    let token = ''

    beforeEach(async () => {
        cliente = await clienteFactory({
            email: 'cliente@email.com',
            password: '123456',
            role: 'Gerente'
        })

        const response = await request(app)
            .post('/login')
            .send({
                email: 'cliente@email.com',
                password: '123456'
            })

        token = response.body.token
    })

    it('deve retornar 200, um array de reservas e as quantidades de reservas confirmadas e canceladas', async () => {
        const [cliente1, cliente2] = await Promise.all([
            clienteFactory(),
            clienteFactory()
        ])
        const [pacote1, pacote2] = await Promise.all([
            pacoteFactory(),
            pacoteFactory()   
        ])
        const [endereco1, endereco2] = await Promise.all([
            enderecoFactory({
                clienteId: cliente1.id
            }),
            enderecoFactory({
                clienteId: cliente2.id
            })
        ])

        const dataInicio = '2025-01-11'
        const dataTermino = '2025-11-11'

        const [reserva1, reserva2] = await Promise.all([
            reservaFactory({
                clienteId: cliente1.id,
                pacoteId: pacote1.id,
                enderecoId: endereco1.id,
                dataInicio: dataInicio,
                status: 'Confirmada'
            }),
            reservaFactory({
                clienteId: cliente2.id,
                pacoteId: pacote2.id,
                enderecoId: endereco2.id,
                dataTermino: dataTermino,
                status: 'Cancelada'
            })
        ])

        const response = await request(app)
            .get(`/relatorios/reservas?dataInicio=${dataInicio}&dataTermino=${dataTermino}`)
            .auth(token, { type: 'bearer' })
        expect(response.status).toBe(200)
        expect(response.body).toEqual(expect.objectContaining({
            reservas: expect.arrayContaining([
                expect.objectContaining({
                    id: reserva1.id.toString(),
                    status: 'Confirmada'
                }),
                expect.objectContaining({
                    id: reserva2.id.toString(),
                    status: 'Cancelada'
                })
            ]),
            qtdReservasConfirmadas: 1,
            qtdReservasCanceladas: 1
        }))
    })

    it('deve retornar 400 se a data de ínicio for maior que a data de término', async () => {
        const dataInicio = '2025-11-11'
        const dataTermino = '2025-01-11'

        const response = await request(app)
            .get(`/relatorios/reservas?dataInicio=${dataInicio}&dataTermino=${dataTermino}`)
            .auth(token, { type: 'bearer' })
        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            success: false,
            message: 'Data de início não pode ser maior que a data de término'
        })
    })
})