import { clientes, type Cliente } from "@/consts/clientes"
import { pacotes, type Pacote } from "@/consts/pacotes"
import { createSlice } from "@reduxjs/toolkit"
import { addFeedbackAction, deleteFeedbackAction, updateFeedbackAction } from "./actions"
import type { Optional } from "@/types/optional"

export type Feedback = {
  id: number
  customer: Cliente
  package: Pacote
  rating: number
  comment: string
}

export type NewFeedback = Optional<Feedback, 'id'>

const feedbacksInitialState = {
  feedbacks: [
    {
      id: 0,
      customer: clientes[3],
      package: pacotes[0],
      rating: 4,
      comment:
        "O setup gamer é excelente, máquinas muito rápidas e silenciosas. Só achei que os fones poderiam ter uma qualidade um pouco melhor.",
    },
    {
      id: 1,
      customer: clientes[4],
      package: pacotes[1],
      rating: 3,
      comment:
        "O notebook é realmente potente e a cadeira é confortável, mas o monitor auxiliar poderia ter mais ajustes de altura. No geral, bom custo-benefício.",
    },
    {
      id: 2,
      customer: clientes[5],
      package: pacotes[2],
      rating: 5,
      comment:
        "Perfeito para o nosso time! Todos ficaram satisfeitos com o desempenho e a ergonomia. O espaço de trabalho colaborativo ficou incrível.",
    },
    {
      id: 3,
      customer: clientes[6],
      package: pacotes[0],
      rating: 4,
      comment:
        "Uso o setup profissional diariamente no home office e tem atendido muito bem. A iluminação para videoconferência foi um diferencial.",
    },
  ]
}

const feedbacksSlice = createSlice({
  name: 'feedback',
  initialState: feedbacksInitialState,
  reducers: {
    addFeedback: ({ feedbacks }, action: { payload: NewFeedback }) => addFeedbackAction(feedbacks, action.payload),
    updateFeedback: ({ feedbacks }, action: { payload: Feedback }) => updateFeedbackAction(feedbacks, action.payload),
    deleteFeedback: ({ feedbacks }, action: { payload: number }) => deleteFeedbackAction(feedbacks, action.payload),
  }
})

export const { addFeedback, deleteFeedback, updateFeedback } = feedbacksSlice.actions

export const feedbacksReducer = feedbacksSlice.reducer