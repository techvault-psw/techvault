import { type Cliente } from "./clientes"

export type Endereco = {
    id: number
    cliente: Cliente
    name: string
    cep: string
    street: string
    description?: string
    number: string
    neighborhood: string
    city: string
    state: string
}

export const stringifyAddress = (x: Endereco) => {
    let desc = ""
    if(x.description) {
        desc = x.description + " - "
    }

    return x.street + ", " + x.number + " - " + desc + x.neighborhood + ", " + x.city + ", " + x.state
}