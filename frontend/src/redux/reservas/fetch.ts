import { API_URL } from "@/lib/api-url"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchReservas = createAsyncThunk("reservas/fetchReservas",
  async () => {
    const response = await fetch(`${API_URL}/reservas?_expand=cliente&_expand=pacote&_expand=endereco`)
    const data = await response.json()
    return { reservas: data }
  }
)