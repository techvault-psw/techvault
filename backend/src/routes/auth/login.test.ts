import request from 'supertest'
import app from '../../app'
import { clienteFactory } from '../../tests/factories/cliente-factory'
import { clientes } from '../../models/cliente'

describe('[POST] /login', () => {
  const email = 'teste@example.com'
  const password = 'senha123'

  it('deve retornar 200 e um token quando as credenciais estão corretas', async () => {
    await clienteFactory({ email, password })

    const response = await request(app)
      .post('/login')
      .send({
        email,
        password,
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
    expect(typeof response.body.token).toBe('string')
  })

  it('deve retornar 401 quando o email não existe', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'inexistente@email.com',
        password,
      })

    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      success: false,
      message: 'Credenciais inválidas',
    })
  })

  it('deve retornar 401 quando a senha está incorreta', async () => {
    await clienteFactory({ email, password })

    const response = await request(app)
      .post('/login')
      .send({
        email,
        password: 'senhaerrada',
      })

    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      success: false,
      message: 'Credenciais inválidas',
    })
  })
})
