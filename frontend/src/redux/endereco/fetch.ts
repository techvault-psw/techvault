import { API_URL } from '@/lib/api-url'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchEnderecos = createAsyncThunk('enderecos/fetchEnderecos',
  async () => {
    const response = await fetch(`${API_URL}/enderecos?_expand=cliente`)
    const data = await response.json()

    return { enderecos: data } 
  }
)
