import { API_URL } from "@/lib/api-url"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchFeedbacks = createAsyncThunk(`feedbacks/fetchFeedbacks`,
  async () => {
    const response = await fetch(`${API_URL}/feedbacks?_embed=cliente&_embed=pacote`)
    const data = await response.json()
    return { feedbacks: data }
  }
)