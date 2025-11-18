import request from 'supertest'
import app from '../../app'
import { pacoteFactory } from '../../tests/factories/pacote-factory'

describe('[GET] /pacotes', () => {
  it('deve retornar 200 e um array de pacotes', async () => {

    const [pacote1, pacote2] = await Promise.all([
      pacoteFactory({
        name: 'pacote 1',
      }),
      pacoteFactory({
        name: 'pacote 2',
      })
    ])

    const response = await request(app)
      .get('/pacotes')
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: pacote1.id.toString(),
        name: pacote1.name,
      }),
      expect.objectContaining({
        id: pacote2.id.toString(),
        name: pacote2.name,
      }),
    ]))
  })
})
