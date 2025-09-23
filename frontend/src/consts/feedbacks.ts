export type Feedback = {
    cliente: String
    nota: number
    descricao: string
    pacoteIndex: number
}

export const feedbacks: Feedback[] = [
  {
    cliente: "João Silva",
    pacoteIndex: 0,
    nota: 4,
    descricao:
      "O setup gamer é excelente, máquinas muito rápidas e silenciosas. Só achei que os fones poderiam ter uma qualidade um pouco melhor.",
  },
  {
    cliente: "Maria Fernandes",
    pacoteIndex: 1,
    nota: 3,
    descricao:
      "O notebook é realmente potente e a cadeira é confortável, mas o monitor auxiliar poderia ter mais ajustes de altura. No geral, bom custo-benefício.",
  },
  {
    cliente: "Diogo Mendonça",
    pacoteIndex: 2,
    nota: 5,
    descricao:
      "Perfeito para o nosso time! Todos ficaram satisfeitos com o desempenho e a ergonomia. O espaço de trabalho colaborativo ficou incrível.",
  },
  {
    cliente: "Roberto Johnson",
    pacoteIndex: 1,
    nota: 4,
    descricao:
      "Uso o setup profissional diariamente no home office e tem atendido muito bem. A iluminação para videoconferência foi um diferencial.",
  },
];
