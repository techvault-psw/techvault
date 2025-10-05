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
  async (cliente) => {
    await httpDelete(`/clientes/${cliente.id}`)
    return cliente.id;
  }
)

export const updateClienteServer = createAsyncThunk<Cliente, Cliente>('clientes/updateClienteServer ',
  async (cliente) => {
    const updatedCliente: ClienteServer = {
      ...cliente
    }

    return await httpPut(`/clientes/${cliente.id}`, updatedCliente)
  }
)



  





