import { httpDelete, httpGet, httpPost, httpPut } from "@/lib/fetch-utils"
import { createAsyncThunk } from "@reduxjs/toolkit"
import type { Feedback, FeedbackServer, NewFeedback, NewFeedbackServer } from "./slice"

export const fetchFeedbacks = createAsyncThunk<Feedback[]>(`feedbacks/fetchFeedbacks`,
  async () => {
    return await httpGet('/feedbacks?_expand=cliente&_expand=pacote')
  }
)

export const addFeedbackServer = createAsyncThunk<Feedback, NewFeedback>('feedbacks/addFeedbackServer ',
  async (newFeedback) => {
    const feedback: NewFeedbackServer = {
      clienteId: newFeedback.cliente.id,
      comentario: newFeedback.comentario,
      pacoteId: newFeedback.pacote.id,
      rating: newFeedback.rating,
    }

    return await httpPost('/feedbacks', feedback)
  }
)

export const updateFeedbackServer = createAsyncThunk<Feedback, Feedback>('feedbacks/updateFeedbackServer ',
  async (feedback) => {
    const updatedFeedback: FeedbackServer = {
      id: feedback.id,
      clienteId: feedback.cliente.id,
      comentario: feedback.comentario,
      pacoteId: feedback.pacote.id,
      rating: feedback.rating,
    }

    return await httpPut(`/feedbacks/${feedback.id}`, updatedFeedback)
  }
)

export const deleteFeedbackServer = createAsyncThunk<number, Feedback>('feedbacks/deleteFeedbackServer ',
  async (feedback) => {
    await httpDelete(`/feedbacks/${feedback.id}`)
    return feedback.id
  }
)