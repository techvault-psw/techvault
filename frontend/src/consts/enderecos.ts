import { type Cliente } from "./clientes"

export type Endereco = {
    id: number
    cliente: Cliente
    name: string
    cep: string
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
}

export const stringifyAddress = (x: Endereco) => {
    return x.street + ", " + x.number + " - " + x.neighborhood + ", " + x.city + ", " + x.state
}