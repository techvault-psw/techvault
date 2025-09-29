import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchClientes = createAsyncThunk('clientes/fetchClientes',
  async () => {
    const response = await fetch('http://localhost:3000/clientes')
    const data = await response.json()
    return { clientes: data }
  }
)