import { httpDelete, httpGet, httpPost, httpPut } from "@/lib/fetch-utils"
import { createAsyncThunk } from "@reduxjs/toolkit"
import type { NewPacote, NewPacoteServer, Pacote, PacoteServer } from "./slice"

export const fetchPacotes = createAsyncThunk<Pacote[]>('pacotes/fetchPacotess',
  async () => {
      return await httpGet(`/pacotes`)
  }
)

export const addPacoteServer = createAsyncThunk<Pacote, NewPacote>('pacotes/addPacoteServer ',
  async (newPacote) => {
    const pacote: NewPacoteServer = {
      name: newPacote.name,
      image: newPacote.image,
      description: newPacote.description,
      components: newPacote.components,
      value: newPacote.value,
      quantity: newPacote.quantity,
    }

    return await httpPost('/pacotes', pacote)
  }
)

export const updatePacoteServer = createAsyncThunk<Pacote, Pacote>('pacotes/updatePacoteServer ',
  async (pacote) => {
    const updatedPacote: PacoteServer = {
      id: pacote.id,
      name: pacote.name,
      image: pacote.image,
      description: pacote.description,
      components: pacote.components,
      value: pacote.value,
      quantity: pacote.quantity,
    }

    return await httpPut(`/pacotes/${pacote.id}`, updatedPacote)
  }
)

export const deletePacoteServer = createAsyncThunk<number, Pacote>('pacotes/deletePacoteServer ',
  async (pacote) => {
    await httpDelete(`/pacotes/${pacote.id}`)
    return pacote.id
  }
)