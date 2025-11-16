import request from 'supertest'
import app from '../../app'
import { pacoteFactory } from '../../tests/factories/pacote-factory'
import { Types } from 'mongoose'

describe('[GET] /pacote/:id', () => {
  it('deve retornar 200 e o pacote', async () => {
    const pacote = await pacoteFactory()

    const response = await request(app)
      .get(`/pacotes/${pacote.id.toString()}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({
      id: pacote.id.toString(),
      quantity: pacote.quantity,
      value: pacote.value,
    }))
  })

  it('deve retornar 400 quando o pacote não existe', async () => {
    const idPacoteInexistente = new Types.ObjectId()

    const response = await request(app)
      .get(`/pacotes/${idPacoteInexistente}`)
      .send()

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      message: 'Pacote não encontrado',
    })
  })
})
