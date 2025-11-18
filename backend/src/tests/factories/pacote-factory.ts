import { faker } from '@faker-js/faker'
import { pacotes, type PacoteSchema } from '../../models/pacote'
import type { Pacote } from '../../consts/types'

export type PacoteFactoryParams = Partial<Omit<Pacote, 'id'>>

export const pacoteFactory = async (params: PacoteFactoryParams = {}): Promise<PacoteSchema> => {
  return await pacotes.create({
    name: params.name ?? faker.commerce.productName(),
    image: params.image ?? faker.image.url(),
    description: params.description ?? [faker.lorem.sentence(15)],
    components: params.components ?? [
      faker.commerce.productMaterial(),
      faker.commerce.productMaterial(),
    ],
    value: params.value ?? Number(faker.commerce.price({ min: 100, max: 5000 })),
    quantity: params.quantity ?? faker.number.int({ min: 5, max: 50 }),
  })
}
