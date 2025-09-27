import { clientes, type Cliente } from "@/consts/clientes"
import { pacotes, type Pacote } from "@/consts/pacotes"
import { createSlice } from "@reduxjs/toolkit"
import { addFeedbackAction } from "./actions"

export type Feedback = {
    cliente: Cliente
    pacote: Pacote
    nota: number
    descricao: string
}

const initialState = {
  feedbacks: [
    {
      cliente: clientes[0],
      pacote: pacotes[0],
      nota: 4,
      descricao:
        "O setup gamer é excelente, máquinas muito rápidas e silenciosas. Só achei que os fones poderiam ter uma qualidade um pouco melhor.",
    },
    {
      cliente: clientes[1],
      pacote: pacotes[1],
      nota: 3,
      descricao:
        "O notebook é realmente potente e a cadeira é confortável, mas o monitor auxiliar poderia ter mais ajustes de altura. No geral, bom custo-benefício.",
    },
    {
      cliente: clientes[2],
      pacote: pacotes[2],
      nota: 5,
      descricao:
        "Perfeito para o nosso time! Todos ficaram satisfeitos com o desempenho e a ergonomia. O espaço de trabalho colaborativo ficou incrível.",
    },
    {
      cliente: clientes[3],
      pacote: pacotes[0],
      nota: 4,
      descricao:
        "Uso o setup profissional diariamente no home office e tem atendido muito bem. A iluminação para videoconferência foi um diferencial.",
    },
  ]
}

const feedbacksSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    addFeedback: (state, action: { payload: Feedback }) => addFeedbackAction(state.feedbacks, action.payload),
    updateFeedback: (state, action) => {},
    deleteFeedback: (state, action) => {},
  }
})

export const { addFeedback, deleteFeedback, updateFeedback } = feedbacksSlice.actions

export const feedbacksReducer = feedbacksSlice.reducer