import { Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import { reservas, type ReservaSchema } from '../../models/reserva'
import type { Reserva } from '../../consts/types'

export type ReservaFactoryParams = Partial<Omit<Reserva, 'id'>> & {
  clienteId: Types.ObjectId
  pacoteId: Types.ObjectId
  enderecoId: Types.ObjectId
}

export const reservaFactory = async (params: ReservaFactoryParams): Promise<ReservaSchema> => {
  if (!params.clienteId) {
    throw new Error('clienteId é obrigatório para criar uma reserva')
  }
  if (!params.pacoteId) {
    throw new Error('pacoteId é obrigatório para criar uma reserva')
  }
  if (!params.enderecoId) {
    throw new Error('enderecoId é obrigatório para criar uma reserva')
  }

  const dataInicio = params.dataInicio ?? faker.date.future()
  const dataTermino = params.dataTermino ?? faker.date.soon({ days: 7, refDate: dataInicio })

  return await reservas.create({
    clienteId: params.clienteId,
    pacoteId: params.pacoteId,
    enderecoId: params.enderecoId,
    valor: params.valor ?? Number(faker.commerce.price({ min: 500, max: 5000 })),
    status: params.status ?? 'Confirmada',
    dataInicio,
    dataTermino,
    dataEntrega: params.dataEntrega,
    dataColeta: params.dataColeta,
    codigoEntrega: params.codigoEntrega ?? faker.string.alphanumeric(7).toUpperCase(),
    codigoColeta: params.codigoColeta ?? faker.string.alphanumeric(7).toUpperCase(),
  })
}
