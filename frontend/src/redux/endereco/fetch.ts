import { httpGet, httpPost, httpDelete, httpPut } from '@/lib/fetch-utils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import type { Endereco } from '@/redux/endereco/slice'
import type { NewEndereco, NewEnderecoServer, EnderecoServer } from './slice'

export const fetchEnderecos = createAsyncThunk<Endereco[]>(`enderecos/fetchEnderecos`, 
  async () => {
    return await httpGet(`/enderecos`)
  }
)

export const addEnderecoServer = createAsyncThunk<Endereco, NewEndereco>('enderecos/addEnderecoServer', 
  async (newEndereco) => {
    const { cliente, id, ...enderecoInfo } = newEndereco

    const endereco: NewEnderecoServer = {
      ...enderecoInfo,
      clienteId: cliente.id
    }

    return await httpPost('/enderecos', endereco)
  }
)

export const updateEnderecoServer = createAsyncThunk<Endereco, Endereco>('enderecos/updateEnderecoServer', 
  async (endereco) => {
    const { cliente, id, ...enderecoInfo } = endereco

    return await httpPut(`/enderecos/${endereco.id}`, enderecoInfo)
  }
)

export const deleteEnderecoServer = createAsyncThunk<string, Endereco>('enderecos/deleteEnderecoServer',
  async (endereco) => {
    await httpDelete(`/enderecos/${endereco.id}`)
    return endereco.id
  }
)
