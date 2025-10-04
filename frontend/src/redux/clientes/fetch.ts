import { API_URL } from "@/lib/api-url"
import { createAsyncThunk } from "@reduxjs/toolkit"
import type { ClienteServer, NewClienteServer, Cliente, NewCliente } from "./slice"
import { httpDelete, httpGet, httpPost, httpPut } from "@/lib/fetch-utils"

export const fetchClientes = createAsyncThunk<Cliente[]>(`clientes/fetchClientes`,
  async () => {
    return await httpGet('/clientes') 
  }
)

export const addClienteServer = createAsyncThunk<Cliente, NewCliente>('clientes/addClienteServer ',
  async (newCliente) => {
    const cliente: NewClienteServer = {
      ...newCliente
    }

    return await httpPost('/clientes', cliente)
  }
)

export const deleteClienteServer = createAsyncThunk<number , Cliente>('clientes/deleteClienteServer ',
  async (Cliente) => {
    await httpDelete(`/clientes/${Cliente.id}`)
    return Cliente.id;
  }
)

export const updateClienteServer = createAsyncThunk<Cliente, Cliente>('clientes/updateClienteServer ',
  async (Cliente) => {
    const updatedCliente: ClienteServer = {
      ...Cliente
    }

    return await httpPut(`/clientes/${Cliente.id}`, updatedCliente)
  }
)



  





