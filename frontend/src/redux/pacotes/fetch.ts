import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchPacotes = createAsyncThunk('pacotes/fetchPacotes',
  async () => {
    const response = await fetch('http://localhost:3000/pacotes')
    const data = await response.json()
    return { pacotes: data }
  }
)