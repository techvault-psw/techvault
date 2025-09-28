import { clientes, type Cliente } from "./clientes"

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

export const enderecos: Endereco[] = [
  {
    id: 0,
    cliente: clientes[0],
    name: "Casa",
    cep: "01001-000",
    street: "Praça da Sé",
    number: "100",
    neighborhood: "Sé",
    city: "São Paulo",
    state: "SP",
  },
  {
    id: 1,
    cliente: clientes[0],
    name: "Trabalho",
    cep: "20040-010",
    street: "Rua da Quitanda",
    number: "250",
    neighborhood: "Centro",
    city: "Rio de Janeiro",
    state: "RJ",
  },
  {
    id: 2,
    cliente: clientes[0],
    name: "Casa de Praia",
    cep: "88010-400",
    street: "Avenida Hercílio Luz",
    number: "75",
    neighborhood: "Centro",
    city: "Florianópolis",
    state: "SC",
  },
  {
    id: 3,
    cliente: clientes[0],
    name: "Faculdade",
    cep: "20271-110",
    street: "Rua General Canabarro",
    number: "485",
    neighborhood: "Tijuca",
    city: "Rio de Janeiro",
    state: "RJ",
  },
  {
    id: 4,
    cliente: clientes[1],
    name: "Casa",
    cep: "01001-000",
    street: "Rua das Flores",
    number: "123",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
  },
  {
    id: 5,
    cliente: clientes[1],
    name: "Trabalho",
    cep: "20040-020",
    street: "Avenida Atlântica",
    number: "456",
    neighborhood: "Copacabana",
    city: "Rio de Janeiro",
    state: "RJ",
  },
  {
    id: 6,
    cliente: clientes[1],
    name: "Casa de Praia",
    cep: "40015-160",
    street: "Rua do Farol",
    number: "789",
    neighborhood: "Barra",
    city: "Salvador",
    state: "BA",
  },
  {
    id: 7,
    cliente: clientes[1],
    name: "Chácara",
    cep: "13015-050",
    street: "Estrada dos Ipês",
    number: "101",
    neighborhood: "Zona Rural",
    city: "Campinas",
    state: "SP",
  },
  {
    id: 8,
    cliente: clientes[2],
    name: "Apartamento",
    cep: "30140-110",
    street: "Rua da Liberdade",
    number: "202",
    neighborhood: "Savassi",
    city: "Belo Horizonte",
    state: "MG",
  },
  {
    id: 9,
    cliente: clientes[2],
    name: "Casa da Mãe",
    cep: "69005-070",
    street: "Travessa dos Jacarandás",
    number: "55",
    neighborhood: "Adrianópolis",
    city: "Manaus",
    state: "AM",
  },
  {
    id: 10,
    cliente: clientes[2],
    name: "Escritório",
    cep: "80010-150",
    street: "Avenida Sete de Setembro",
    number: "1500",
    neighborhood: "Centro",
    city: "Curitiba",
    state: "PR",
  },
  {
    id: 11,
    cliente: clientes[2],
    name: "Sítio",
    cep: "86010-020",
    street: "Estrada das Palmeiras",
    number: "KM 12",
    neighborhood: "Zona Rural",
    city: "Londrina",
    state: "PR",
  },
]