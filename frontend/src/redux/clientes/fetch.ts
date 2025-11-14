import { createAsyncThunk } from "@reduxjs/toolkit"
import type { ClienteServer, NewClienteServer, Cliente, NewCliente } from "./slice"
import { httpDelete, httpGet, httpPost, httpPut } from "@/lib/fetch-utils"
import { API_URL } from "@/lib/api-url"

export const fetchClientes = createAsyncThunk<Cliente[]>(`clientes/fetchClientes`,
  async () => {
    return await httpGet('/clientes') 
  }
)

export const addClienteServer = createAsyncThunk<Cliente, NewCliente>('clientes/addClienteServer ',
  async (newCliente) => {
    return await httpPost('/clientes', newCliente)
  }
)

export const deleteClienteServer = createAsyncThunk<string , Cliente>('clientes/deleteClienteServer ',
  async (cliente) => {
    await httpDelete(`/clientes/${cliente.id}`)
    return cliente.id;
  }
)

export const updateClienteServer = createAsyncThunk<Cliente, Cliente>('clientes/updateClienteServer ',
  async (cliente) => {
    const { id, ...updatedCliente } = cliente

    return await httpPut(`/clientes/${cliente.id}`, updatedCliente)
  }
)

export const loginServer = createAsyncThunk<
  { token: string; status: number },
  { email: string; password: string },
  { rejectValue: { status: number; message: string } }
>('clientes/loginServer', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (response.ok) {
      return { token: data.token, status: response.status }
    }

    return rejectWithValue({ status: response.status, message: data.message || 'Erro ao fazer login' })
  } catch (error) {
    return rejectWithValue({ status: 500, message: 'Erro de conexão' })
  }
})



  





