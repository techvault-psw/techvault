import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import type { ClienteSchema } from '../../models/cliente'
import path from 'path'
import * as UploadImageUtil from '../../utils/upload-image'

describe('[POST] /pacotes/upload-image', () => {
  let gerente: ClienteSchema
  let token = ''
  let mockImagePath = ''

  beforeAll(() => {
    mockImagePath = path.resolve(
      process.cwd(),
      'src/tests/assets/setup-1.png',
    )
  })

  beforeEach(async () => {
    gerente = await clienteFactory({
      email: 'gerente.upload@email.com',
      password: '123456',
      role: 'Gerente',
    })

    const response = await request(app).post('/login').send({
      email: 'gerente.upload@email.com',
      password: '123456',
    })

    token = response.body.token

    jest.restoreAllMocks()
  })

  it('deve retornar 200 e a URL da imagem em um upload bem-sucedido', async () => {
    const response = await request(app)
      .post('/pacotes/upload-image')
      .auth(token, { type: 'bearer' })
      .attach('file', mockImagePath)

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        url: expect.any(String),
      }),
    )
  })

  it('deve retornar 422 se nenhum arquivo for enviado', async () => {

    const response = await request(app)
      .post('/pacotes/upload-image')
      .auth(token, { type: 'bearer' })
      // .attach('file', mockImagePath)

    expect(response.status).toBe(422)
    expect(response.body).toEqual(expect.objectContaining({
      success: false,
    }))
  })

  it('deve retornar 500 se o uploadImage falhar', async () => {
    const uploadImageSpy = jest
      .spyOn(UploadImageUtil, 'uploadImage')
      .mockRejectedValue(new Error('Erro simulado no upload'))

    const response = await request(app)
      .post('/pacotes/upload-image')
      .auth(token, { type: 'bearer' })
      .attach('file', mockImagePath)

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      success: false,
      message: 'Ocorreu um erro ao realizar o upload da imagem',
    })
  })
})