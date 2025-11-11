import { httpDelete, httpGet, httpPost, httpPut } from "@/lib/fetch-utils"
import { createAsyncThunk } from "@reduxjs/toolkit"
import type { Feedback, NewFeedback, NewFeedbackServer } from "./slice"

export const fetchFeedbacks = createAsyncThunk<Feedback[]>(`feedbacks/fetchFeedbacks`,
  async () => {
    return await httpGet('/feedbacks')
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
    return await httpPut(`/feedbacks/${feedback.id}`, {
      comentario: feedback.comentario,
      rating: feedback.rating,
    })
  }
)

export const deleteFeedbackServer = createAsyncThunk<string, Feedback>('feedbacks/deleteFeedbackServer ',
  async (feedback) => {
    await httpDelete(`/feedbacks/${feedback.id}`)
    return feedback.id
  }
)