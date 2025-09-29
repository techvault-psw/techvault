import { type Cliente } from "@/consts/clientes"
import { createSlice } from "@reduxjs/toolkit"
import { addFeedbackAction, deleteFeedbackAction, updateFeedbackAction } from "./actions"
import type { Optional } from "@/types/optional"
import type { Pacote } from "../pacotes/slice"
import { fetchFeedbacks } from "./fetch"

export type Feedback = {
  id: number
  cliente: Cliente
  pacote: Pacote
  rating: number
  comentario: string
}

export type NewFeedback = Optional<Feedback, 'id'>

const feedbacksInitialState: { feedbacks: Feedback[] } = {
  feedbacks: []
}

const feedbacksSlice = createSlice({
  name: 'feedback',
  initialState: feedbacksInitialState,
  reducers: {
    addFeedback: ({ feedbacks }, action: { payload: NewFeedback }) => addFeedbackAction(feedbacks, action.payload),
    updateFeedback: ({ feedbacks }, action: { payload: Feedback }) => updateFeedbackAction(feedbacks, action.payload),
    deleteFeedback: ({ feedbacks }, action: { payload: number }) => deleteFeedbackAction(feedbacks, action.payload),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeedbacks.fulfilled, (_, action) => action.payload)
  }
})

export const { addFeedback, deleteFeedback, updateFeedback } = feedbacksSlice.actions

export const feedbacksReducer = feedbacksSlice.reducer