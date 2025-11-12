import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { clientes, type ClienteSchema } from './models/cliente';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'jwt-secret-key'

export const getToken = (cliente: ClienteSchema) => {
  return jwt.sign(
    { id: cliente._id, role: cliente.role },
    jwtSecret,
    { expiresIn: '7d' }
  )
}

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
}

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const cliente = await clientes.findById(payload.id)
      
      if (cliente) {
        return done(null, cliente)
      }
      
      return done(null, false)
    } catch (error) {
      return done(error, false)
    }
  })
)

export default passport
