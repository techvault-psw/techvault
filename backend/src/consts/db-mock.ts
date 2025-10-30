import type { Cliente, Endereco, Feedback, Pacote, Reserva } from "./types"

export const clientes: Cliente[] = []

export const enderecos: Endereco[] = []

export const pacotes: Pacote[] = []

export const reservas: Reserva[] = []

export const feedbacks: Feedback[] = [
  {
    id: "ffa7ac13-40fc-4d03-9f73-7e731d8bfb74",
    clienteId: "e058ec90-d701-44ee-9eec-d4192639095e",
    pacoteId: "669186d6-1224-474a-8092-2ddedfb268ee",
    rating: 4,
    comentario: "O setup gamer é excelente, máquinas muito rápidas e silenciosas. Só achei que os fones poderiam ter uma qualidade um pouco melhor.",
  },
  {
    id: "cbe695b0-cc9f-43e6-a33a-a2eddac3c0a2",
    clienteId: "f0da4a6a-cbf2-4544-9032-ebf8056ccd10",
    pacoteId: "0348dba9-264f-40d1-aa63-22310eb3b62a",
    rating: 3,
    comentario: "O notebook é realmente potente e a cadeira é confortável, mas o monitor auxiliar poderia ter mais ajustes de altura. No geral, bom custo-benefício.",
  },
  {
    id: "886a0a7c-f938-4dce-a5d2-04c5bb55e507",
    clienteId: "872d7718-300c-4cd4-9d34-015f91974001",
    pacoteId: "dcd6e301-2560-48a1-9135-92bd3f0c2401",
    rating: 5,
    comentario: "Perfeito para o nosso time! Todos ficaram satisfeitos com o desempenho e a ergonomia. O espaço de trabalho colaborativo ficou incrível.",
  },
  {
    id: "bdf432fb-b741-430e-ad74-8bd0dbbea6b0",
    clienteId: "2e9b15e5-fadf-4d5e-961e-b99a3e588b42",
    pacoteId: "669186d6-1224-474a-8092-2ddedfb268ee",
    rating: 4,
    comentario: "Uso o setup profissional diariamente no home office e tem atendido muito bem. A iluminação para videoconferência foi um diferencial.",
  },
]
