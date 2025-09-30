import { API_URL } from "@/lib/api-url"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchPacotes = createAsyncThunk('pacotes/fetchPacotes',
  async () => {
    const response = await fetch(`${API_URL}/pacotes`)
    const data = await response.json()
    return { pacotes: data }
  }
)