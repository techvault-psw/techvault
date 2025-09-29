import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchFeedbacks = createAsyncThunk(`feedbacks/fetchFeedbacks`,
  async () => {
    const response = await fetch('http://localhost:3000/feedbacks?_embed=cliente&_embed=pacote')
    const data = await response.json()
    return { feedbacks: data }
  }
)