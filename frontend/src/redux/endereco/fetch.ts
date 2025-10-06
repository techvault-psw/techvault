import { httpGet, httpPost, httpDelete, httpPut } from '@/lib/fetch-utils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import type { Endereco } from '@/redux/endereco/slice'
import type { NewEndereco, NewEnderecoServer, EnderecoServer } from './slice'

export const fetchEnderecos = createAsyncThunk<Endereco[]>(`enderecos/fetchEnderecos`, 
  async () => {
    return await httpGet(`/enderecos?_expand=cliente`)
  }
)

export const addEnderecoServer = createAsyncThunk<Endereco, NewEndereco>('enderecos/addEnderecoServer', 
  async (newEndereco) => {
    const { cliente, ...enderecoInfo } = newEndereco

    const endereco: NewEnderecoServer = {
      ...enderecoInfo,
      clienteId: cliente.id
    }

    return await httpPost('/enderecos', endereco)
  }
)

export const updateEnderecoServer = createAsyncThunk<Endereco, Endereco>('enderecos/updateEnderecoServer', 
  async (endereco) => {
    const { cliente, ...enderecoInfo } = endereco

    const updatedEndereco: EnderecoServer = {
      ...enderecoInfo,
      clienteId: cliente.id
    }
    return await httpPut(`/enderecos/${endereco.id}`, updatedEndereco)
  }
)

export const deleteEnderecoServer = createAsyncThunk<number, Endereco>('enderecos/deleteEnderecoServer',
  async (endereco) => {
    await httpDelete(`/enderecos/${endereco.id}`)
    return endereco.id
  }
)
