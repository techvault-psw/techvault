export type Reserva = {
    pacoteIndex: number
    valor: number
    status: "Confirmada" | "Cancelada" | "Concluída",
    dataInicio: Date,
    dataTermino: Date,
    endereco: string,
    codigoEntrega: string,
    codigoColeta: string
}

export const reservas: Reserva[] = [
  {
    pacoteIndex: 0,
    valor: 500.00,
    status: "Confirmada",
    dataInicio: new Date("2025-10-01T10:00:00"),
    dataTermino: new Date("2025-10-05T10:00:00"),
    endereco: "Rua das Flores, 123, São Paulo, SP",
    codigoEntrega: "ENT12345",
    codigoColeta: "COL12345"
  },
  {
    pacoteIndex: 1,
    valor: 300.00,
    status: "Cancelada",
    dataInicio: new Date("2025-10-10T12:00:00"),
    dataTermino: new Date("2025-10-12T12:00:00"),
    endereco: "Avenida Brasil, 456, Rio de Janeiro, RJ",
    codigoEntrega: "ENT67890",
    codigoColeta: "COL67890"
  },
  {
    pacoteIndex: 2,
    valor: 700.00,
    status: "Concluída",
    dataInicio: new Date("2025-09-20T08:00:00"),
    dataTermino: new Date("2025-09-25T08:00:00"),
    endereco: "Praça Central, 789, Belo Horizonte, MG",
    codigoEntrega: "ENT11121",
    codigoColeta: "COL11121"
  }
];
