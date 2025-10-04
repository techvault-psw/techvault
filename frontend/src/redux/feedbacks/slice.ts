import { type Cliente } from "@/consts/clientes"
import type { Optional } from "@/types/optional"
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import type { Pacote } from "../pacotes/slice"
import type { InitialState, RootState } from "../root-reducer"
import { addFeedbackServer, deleteFeedbackServer, fetchFeedbacks, updateFeedbackServer } from "./fetch"

export type Feedback = {
  id: number
  cliente: Cliente
  pacote: Pacote
  rating: number
  comentario: string
}

export type NewFeedback = Optional<Feedback, 'id'>

export type FeedbackServer = {
  id: number
  clienteId: number
  pacoteId: number
  rating: number
  comentario: string
}

export type NewFeedbackServer = Optional<FeedbackServer, 'id'>

const feedbacksAdapter = createEntityAdapter<Feedback>()

const feedbacksInitialState = feedbacksAdapter.getInitialState<InitialState>({
  status: 'not_loaded',
  error: null,
})

const feedbacksSlice = createSlice({
  name: 'feedback',
  initialState: feedbacksInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending,         (state, action) => { state.status = 'loading' })
      .addCase(fetchFeedbacks.fulfilled,       (state, action) => { state.status = 'loaded'; feedbacksAdapter.setAll(state, action.payload) })
      .addCase(fetchFeedbacks.rejected,        (state, action) => { state.status = 'failed'; state.error = 'Falha ao buscar feedbacks!' })
      .addCase(addFeedbackServer.pending,      (state, action) => { state.status = 'saving' })
      .addCase(addFeedbackServer.fulfilled,    (state, action) => { state.status = 'saved';  feedbacksAdapter.addOne(state, action.payload) })
      .addCase(addFeedbackServer.rejected,     (state, action) => { state.status = 'failed'; state.error = 'Falha ao adicionar feedback!' })
      .addCase(updateFeedbackServer.pending,   (state, action) => { state.status = 'saving' })
      .addCase(updateFeedbackServer.fulfilled, (state, action) => { state.status = 'saved';  feedbacksAdapter.upsertOne(state, action.payload) })
      .addCase(updateFeedbackServer.rejected,  (state, action) => { state.status = 'failed'; state.error = 'Falha ao atualizar feedback!' })
      .addCase(deleteFeedbackServer.pending,   (state, action) => { state.status = 'deleting' })
      .addCase(deleteFeedbackServer.fulfilled, (state, action) => { state.status = 'deleted'; feedbacksAdapter.removeOne(state, action.payload) })
      .addCase(deleteFeedbackServer.rejected,  (state, action) => { state.status = 'failed';  state.error = 'Falha ao excluir feedback!' })
  }
})

export const feedbacksReducer = feedbacksSlice.reducer

export const {
  selectAll: selectAllFeedbacks,
  selectById: selectFeedbackById,
  selectIds: selectFeedbacksIds,
} = feedbacksAdapter.getSelectors((reducer: RootState) => reducer.feedbacksReducer)