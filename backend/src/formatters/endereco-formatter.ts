import type { Endereco, EnderecoExtended } from "../consts/types";
import type { EnderecoSchema, PopulatedEnderecoSchema } from "../models/endereco";
import { ClienteFormatter } from "./cliente-formatter";

export function EnderecoFormatter(endereco: EnderecoSchema): Endereco {
  return {
    id: endereco._id.toString(),
    clienteId: endereco.clienteId.toString(),
    name: endereco.name,
    cep: endereco.cep,
    street: endereco.street,
    number: endereco.number,
    description: endereco.description,
    neighborhood: endereco.neighborhood,
    city: endereco.city,
    state: endereco.state
  }
}

export function PopulatedEnderecoFormatter(endereco: PopulatedEnderecoSchema): EnderecoExtended {
  return {
    id: endereco._id.toString(),
    clienteId: endereco.clienteId._id.toString(),
    cliente: ClienteFormatter(endereco.clienteId),
    name: endereco.name,
    cep: endereco.cep,
    street: endereco.street,
    number: endereco.number,
    description: endereco.description,
    neighborhood: endereco.neighborhood,
    city: endereco.city,
    state: endereco.state
  }
}