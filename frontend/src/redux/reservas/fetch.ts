import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchReservas = createAsyncThunk("reservas/fetchReservas",
  async () => {
    const response = await fetch('http://localhost:3000/reservas?_embed=cliente&_embed=pacote&_embed=endereco')
    const data = await response.json()
    return { reservas: data }
  }
)