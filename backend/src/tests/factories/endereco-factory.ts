import { Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import { enderecos, type EnderecoSchema } from '../../models/endereco'
import type { Endereco } from '../../consts/types'

export type EnderecoFactoryParams = Partial<Omit<Endereco, 'id'>> & {
  clienteId: Types.ObjectId
}

export const enderecoFactory = async (params: EnderecoFactoryParams): Promise<EnderecoSchema> => {
  if (!params.clienteId) {
    throw new Error('clienteId é obrigatório para criar um endereço')
  }

  return await enderecos.create({
    clienteId: params.clienteId,
    name: params.name ?? faker.location.streetAddress(),
    cep: params.cep ?? faker.location.zipCode('#####-###'),
    street: params.street ?? faker.location.street(),
    number: params.number ?? faker.location.buildingNumber(),
    description: params.description,
    neighborhood: params.neighborhood ?? faker.location.county(),
    city: params.city ?? faker.location.city(),
    state: params.state ?? faker.location.state({ abbreviated: true }),
  })
}
