import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { Optional } from "@/types/optional";
import type { Pacote } from "../pacotes/slice";
import type { Endereco } from "@/redux/endereco/slice";
import type { InitialState, RootState } from "../root-reducer";

import {addReservaServer, cancelReservaServer, coletarReservaServer, entregarReservaServer, fetchReservas, updateReservaServer} from "./fetch";
import type { Cliente } from "../clientes/slice";

export type Reserva = {
  id: string
  pacote: Pacote
  valor: number
  status: "Confirmada" | "Cancelada" | "Concluída"
  dataInicio: string
  dataTermino: string
  dataEntrega?: string
  dataColeta?: string
  endereco: Endereco
  codigoEntrega: string
  codigoColeta: string
  cliente: Cliente
}

export type NewReserva = Optional<Reserva, "id" | "codigoEntrega" | "codigoColeta" | "valor">

export type ReservaServer = {
  id: string
  valor: number
  status: "Confirmada" | "Cancelada" | "Concluída"
  dataInicio: string
  dataTermino: string
  dataEntrega?: string
  dataColeta?: string
  codigoEntrega: string
  codigoColeta: string
  clienteId: string
  pacoteId: string
  enderecoId: string
}

export type NewReservaServer = Optional<ReservaServer, "id" | "codigoEntrega" | "codigoColeta" | "valor">

const reservasAdapter = createEntityAdapter<Reserva>()

const reservasInitialState = reservasAdapter.getInitialState<InitialState>({
  status: 'not_loaded',
  error: null
})

const reservasSlice = createSlice({
  name: 'reserva',
  initialState: reservasInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
          .addCase(fetchReservas.pending,           (state, action) => { state.status = 'loading' })
          .addCase(fetchReservas.fulfilled,         (state, action) => { state.status = 'loaded'; reservasAdapter.setAll(state, action.payload) })
          .addCase(fetchReservas.rejected,          (state, action) => { state.status = 'failed'; state.error = 'Falha ao buscar reservas!' })
          .addCase(addReservaServer.pending,        (state, action) => { state.status = 'saving' })
          .addCase(addReservaServer.fulfilled,      (state, action) => { state.status = 'saved'; })
          .addCase(addReservaServer.rejected,       (state, action) => { state.status = 'failed'; state.error = 'Falha ao adicionar reserva!' })
          .addCase(updateReservaServer.pending,     (state, action) => { state.status = 'saving' })
          .addCase(updateReservaServer.fulfilled,   (state, action) => { state.status = 'saved';  reservasAdapter.upsertOne(state, action.payload) })
          .addCase(updateReservaServer.rejected,    (state, action) => { state.status = 'failed'; state.error = 'Falha ao atualizar reserva!' })
          .addCase(entregarReservaServer.pending,   (state, action) => { state.status = 'saving' })
          .addCase(entregarReservaServer.fulfilled, (state, action) => { state.status = 'saved';  reservasAdapter.upsertOne(state, action.payload) })
          .addCase(entregarReservaServer.rejected,  (state, action) => { state.status = 'failed'; state.error = 'Falha ao confirmar entrega da reserva!' })
          .addCase(coletarReservaServer.pending,    (state, action) => { state.status = 'saving' })
          .addCase(coletarReservaServer.fulfilled,  (state, action) => { state.status = 'saved';  reservasAdapter.upsertOne(state, action.payload) })
          .addCase(coletarReservaServer.rejected,   (state, action) => { state.status = 'failed'; state.error = 'Falha ao confirmar coleta da reserva!' })
          .addCase(cancelReservaServer.pending,     (state, action) => { state.status = 'deleting' })
          .addCase(cancelReservaServer.fulfilled,   (state, action) => { state.status = 'deleted'; reservasAdapter.upsertOne(state, action.payload) })
          .addCase(cancelReservaServer.rejected,    (state, action) => { state.status = 'failed';  state.error = 'Falha ao cancelar reserva!' })
    
  }
})

export const reservasReducer = reservasSlice.reducer

export const {
  selectAll: selectAllReservas,
  selectById: selectReservaById,
  selectIds: selectReservasIds,
} = reservasAdapter.getSelectors((reducer: RootState) => reducer.reservasReducer)
