export type Endereco = {
    name: string
    cep: string
    street: string
    number: number
    neighborhood: string
    city: string
    state: string
}

export const stringifyAddress = (x: Endereco) => {
    return x.street + ", " + x.number + " - " + x.neighborhood + ", " + x.city + ", " + x.state
}

export const enderecos: Endereco[] = [
  {
    name: "Casa",
    cep: "01001-000",
    street: "Praça da Sé",
    number: 100,
    neighborhood: "Sé",
    city: "São Paulo",
    state: "SP",
  },
  {
    name: "Trabalho",
    cep: "20040-010",
    street: "Rua da Quitanda",
    number: 250,
    neighborhood: "Centro",
    city: "Rio de Janeiro",
    state: "RJ",
  },
  {
    name: "Casa de Praia",
    cep: "88010-400",
    street: "Avenida Hercílio Luz",
    number: 75,
    neighborhood: "Centro",
    city: "Florianópolis",
    state: "SC",
  },
  {
    name: "Faculdade",
    cep: "20271-110",
    street: "Rua General Canabarro",
    number: 485,
    neighborhood: "Tijuca",
    city: "Rio de Janeiro",
    state: "RJ",
  },
]