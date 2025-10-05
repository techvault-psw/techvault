import { type Optional } from "@/types/optional";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { InitialState, RootState } from "../root-reducer";
import { addPacoteServer, deletePacoteServer, fetchPacotes, updatePacoteServer } from "./fetch";

export type Pacote = {
  id: number
  name: string
  image: string
  description: string[]
  components: string[]
  value: number
  quantity: number
}

export type PacoteServer = Pacote

export type NewPacote = Optional<Pacote, 'id'>

export type NewPacoteServer = Optional<Pacote, 'id'>

const pacoteAdapter = createEntityAdapter<Pacote>()

const pacoteInitialState = pacoteAdapter.getInitialState<InitialState>({
  status: 'not_loaded',
  error: null 
})

const pacotesSlice = createSlice({
  name: 'pacotes',
  initialState: pacoteInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPacotes.pending,         (state, action) => { state.status = 'loading' })
      .addCase(fetchPacotes.fulfilled,       (state, action) => { state.status = 'loaded'; pacoteAdapter.setAll(state, action.payload) })
      .addCase(fetchPacotes.rejected,        (state, action) => { state.status = 'failed'; state.error = 'Falha ao buscar pacotes!' })
      .addCase(addPacoteServer.pending,      (state, action) => { state.status = 'saving' })
      .addCase(addPacoteServer.fulfilled,    (state, action) => { state.status = 'saved'; pacoteAdapter.addOne(state, action.payload) })
      .addCase(addPacoteServer.rejected,     (state, action) => { state.status = 'failed'; state.error = 'Falha ao adicionar pacote!' })
      .addCase(updatePacoteServer.pending,   (state, action) => { state.status = 'saving' })
      .addCase(updatePacoteServer.fulfilled, (state, action) => { state.status = 'saved';  pacoteAdapter.upsertOne(state, action.payload) })
      .addCase(updatePacoteServer.rejected,  (state, action) => { state.status = 'failed'; state.error = 'Falha ao atualizar pacote!' })
      .addCase(deletePacoteServer.pending,   (state, action) => { state.status = 'deleting' })
      .addCase(deletePacoteServer.fulfilled, (state, action) => { state.status = 'deleted'; pacoteAdapter.removeOne(state, action.payload) })
      .addCase(deletePacoteServer.rejected,  (state, action) => { state.status = 'failed';  state.error = 'Falha ao excluir pacote!' })
  }
})

export const pacotesReducer = pacotesSlice.reducer

export const {
  selectAll: selectAllPacotes,
  selectById: selectPacoteById,
  selectIds: selectPacoteIds
} = pacoteAdapter.getSelectors((state: RootState) => state.pacotesReducer)