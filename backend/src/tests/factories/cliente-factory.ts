import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'
import { clientes, type ClienteSchema } from '../../models/cliente'
import type { Cliente } from '../../consts/types'

export type ClienteFactoryParams = Partial<Omit<Cliente, 'id' | 'registrationDate'>> & {
  registrationDate?: Date
}

export const clienteFactory = async (params: ClienteFactoryParams = {}): Promise<ClienteSchema> => {
  const defaultPassword = '123456'
  const hashedPassword = params.password 
    ? await bcrypt.hash(params.password, 10)
    : await bcrypt.hash(defaultPassword, 10)

  return await clientes.create({
    name: params.name ?? faker.person.fullName(),
    email: params.email ?? faker.internet.email(),
    phone: params.phone ?? faker.phone.number(),
    password: hashedPassword,
    role: params.role ?? 'Cliente',
    registrationDate: params.registrationDate ?? new Date(),
  })
}
