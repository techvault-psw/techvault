import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchEnderecos = createAsyncThunk('enderecos/fetchEnderecos',
  async () => {
    const response = await fetch('http://localhost:3000/enderecos?_embed=cliente')
    const data = await response.json()

    return { enderecos: data } 
  }
)
