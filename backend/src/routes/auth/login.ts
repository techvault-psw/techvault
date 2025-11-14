import bcrypt from "bcrypt";
import { CreateTypedRouter } from 'express-zod-openapi-typed';
import z from 'zod';
import { clientes } from '../../models/cliente';
import { getToken } from "../../passport";

const router = CreateTypedRouter();

router.post('/login', {
  schema: {
    summary: 'Login',
    tags: ['Autenticação'],
    body: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
    response: {
      200: z.object({
        token: z.string(),
      }),
      401: z.object({
        success: z.boolean(),
        message: z.string(),
      })
    },
  },
}, async (req, res) => {
  const { email, password } = req.body

  const cliente = await clientes.findOne({ email });

  if (!cliente) {
    return res.status(401).json({
      success: false,
      message: 'Credenciais inválidas',
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, cliente.password)

  if (!isPasswordCorrect) {
    return res.status(401).send({
      success: false,
      message: 'Credenciais inválidas',
    })
  }

  const token = getToken(cliente)

  return res.status(200).send({
    token,
  })
})

export const loginRoute = router;
