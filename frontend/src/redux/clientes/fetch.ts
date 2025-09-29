import { API_URL } from "@/lib/api-url"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchClientes = createAsyncThunk('clientes/fetchClientes',
  async () => {
    const response = await fetch(`${API_URL}/clientes`)
    const data = await response.json()
    return { clientes: data }
  }
)