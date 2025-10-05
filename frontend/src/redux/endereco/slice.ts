import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { type Endereco } from '@/consts/enderecos'
import { type Optional } from "@/types/optional";
import { fetchEnderecos, addEnderecoServer, updateEnderecoServer, deleteEnderecoServer } from './fetch.ts'
import type { InitialState } from "../root-reducer.ts";
import type { RootState } from "../root-reducer.ts";

export type NewEndereco = Optional<Endereco, 'id'>

export type EnderecoServer = {
  id: number,
  clienteId: number,
  name: string,
  cep: string,
  street: string,
  number: string,
  neighborhood: string,
  city: string,
  state: string
}

export type NewEnderecoServer = Optional<EnderecoServer, 'id'>

const enderecosAdapter = createEntityAdapter<Endereco>()

const enderecosInitialState = enderecosAdapter.getInitialState<InitialState>({
  status: 'not_loaded',
  error: null
})

const enderecosSlice = createSlice({
    name: 'enderecos',
    initialState: enderecosInitialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchEnderecos.pending,         (state, action) => { state.status = 'loading' })
        .addCase(fetchEnderecos.fulfilled,       (state, action) => { state.status = 'loaded'; enderecosAdapter.setAll(state, action.payload) })
        .addCase(fetchEnderecos.rejected,        (state, action) => { state.status = 'failed'; state.error = 'Falha ao buscar endereços!' })
        .addCase(addEnderecoServer.pending,      (state, action) => { state.status = 'saving' })
        .addCase(addEnderecoServer.fulfilled,    (state, action) => { state.status = 'saved'; })
        .addCase(addEnderecoServer.rejected,     (state, action) => { state.status = 'failed'; state.error = 'Falha ao adicionar endereços!' })
        .addCase(updateEnderecoServer.pending,   (state, action) => { state.status = 'saving' })
        .addCase(updateEnderecoServer.fulfilled, (state, action) => { state.status = 'saved';  enderecosAdapter.upsertOne(state, action.payload) })
        .addCase(updateEnderecoServer.rejected,  (state, action) => { state.status = 'failed'; state.error = 'Falha ao atualizar endereços!' })
        .addCase(deleteEnderecoServer.pending,   (state, action) => { state.status = 'deleting' })
        .addCase(deleteEnderecoServer.fulfilled, (state, action) => { state.status = 'deleted'; enderecosAdapter.removeOne(state, action.payload) })
        .addCase(deleteEnderecoServer.rejected,  (state, action) => { state.status = 'failed';  state.error = 'Falha ao excluir endereços!' })
    }
})

export const enderecosReducer = enderecosSlice.reducer

export const {
  selectAll: selectAllEnderecos,
  selectById: selectEnderecoById,
  selectIds: selectEnderecosIds,
} = enderecosAdapter.getSelectors((reducer: RootState) => reducer.enderecosReducer)
