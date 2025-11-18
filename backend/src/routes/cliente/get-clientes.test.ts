import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'

describe('[GET] /clientes', () => {
  it('deve retornar 200 e um array de clientes', async () => {

    const [cliente1, cliente2] = await Promise.all([
      clienteFactory({
        name: 'cliente 1',
      }),
      clienteFactory({
        name: 'cliente 2',
      })
    ])

    const response = await request(app)
      .get('/clientes')
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: cliente1.id.toString(),
        name: cliente1.name,
      }),
      expect.objectContaining({
        id: cliente2.id.toString(),
        name: cliente2.name,
      }),
    ]))
  })
})
