import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
// import { addReservaAction, deleteReservaAction, updateReservaAction } from "./actions";
import { type Cliente } from "@/consts/clientes"
import type { Optional } from "@/types/optional";
import type { Pacote } from "../pacotes/slice";
import type { Endereco } from "@/consts/enderecos";
// import { fetchReservas } from "./fetch";
import type { InitialState, RootState } from "../root-reducer";

import {addReservaServer, cancelReservaServer, fetchReservas, updateReservaServer} from "./fetch";

export type Reserva = {
  id: number
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
  id: number
  valor: number
  status: "Confirmada" | "Cancelada" | "Concluída"
  dataInicio: string
  dataTermino: string
  dataEntrega?: string
  dataColeta?: string
  codigoEntrega: string
  codigoColeta: string
  clienteId: number
  pacoteId: number
  enderecoId: number
}

export type NewReservaServer = Optional<ReservaServer, "id" | "codigoEntrega" | "codigoColeta" | "valor">

const reservasAdapter = createEntityAdapter<Reserva>()

const reservasInitialState = reservasAdapter.getInitialState<InitialState>({
  status: 'not_loaded',
  error: null
})

// const initialState: { reservas: Reserva[] } = {
//   reservas: []
// }

const reservasSlice = createSlice({
  name: 'reserva',
  initialState: reservasInitialState,
  // reducers: {
  //   addReserva: (state, action: { payload: NewReserva }) => addReservaAction(state.reservas, action.payload),
  //   updateReserva: (state, action: { payload: Reserva }) => updateReservaAction(state.reservas, action.payload),
  //   deleteReserva: (state, action: { payload: number }) => deleteReservaAction(state.reservas, action.payload)
  // },
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(fetchReservas.fulfilled, (_, action) => action.payload)
    builder
          .addCase(fetchReservas.pending,         (state, action) => { state.status = 'loading' })
          .addCase(fetchReservas.fulfilled,       (state, action) => { state.status = 'loaded'; reservasAdapter.setAll(state, action.payload) })
          .addCase(fetchReservas.rejected,        (state, action) => { state.status = 'failed'; state.error = 'Falha ao buscar reservas!' })
          .addCase(addReservaServer.pending,      (state, action) => { state.status = 'saving' })
          .addCase(addReservaServer.fulfilled,    (state, action) => { state.status = 'saved'; })
          .addCase(addReservaServer.rejected,     (state, action) => { state.status = 'failed'; state.error = 'Falha ao adicionar reserva!' })
          .addCase(updateReservaServer.pending,   (state, action) => { state.status = 'saving' })
          .addCase(updateReservaServer.fulfilled, (state, action) => { state.status = 'saved';  reservasAdapter.upsertOne(state, action.payload) })
          .addCase(updateReservaServer.rejected,  (state, action) => { state.status = 'failed'; state.error = 'Falha ao atualizar reserva!' })
          .addCase(cancelReservaServer.pending,   (state, action) => { state.status = 'deleting' })
          .addCase(cancelReservaServer.fulfilled, (state, action) => { state.status = 'deleted'; reservasAdapter.upsertOne(state, action.payload) })
          .addCase(cancelReservaServer.rejected,  (state, action) => { state.status = 'failed';  state.error = 'Falha ao cancelar reserva!' })
    
  }
})

// export const { addReserva, deleteReserva, updateReserva } = reservasSlice.actions

export const reservasReducer = reservasSlice.reducer


export const {
  selectAll: selectAllReservas,
  selectById: selectReservaById,
  selectIds: selectReservasIds,
} = reservasAdapter.getSelectors((reducer: RootState) => reducer.reservasReducer)
