import { createSlice } from "@reduxjs/toolkit";
import { addReservaAction, deleteReservaAction, updateReservaAction } from "./actions";
import { clientes, type Cliente } from "@/consts/clientes"
import type { Optional } from "@/types/optional";
import type { Pacote } from "../pacotes/slice";
import { pacotes } from "@/consts/pacotes";
import { enderecosInitialState } from "../endereco/slice";
import type { Endereco } from "@/consts/enderecos";
import { fetchReservas } from "./fetch";

export type Reserva = {
    id: number
    pacote: Pacote
    valor: number
    status: "Confirmada" | "Cancelada" | "Concluída"
    dataInicio: string
    dataTermino: string
    endereco: Endereco
    codigoEntrega: string
    codigoColeta: string
    cliente: Cliente
    
}

export type NewReserva = Optional<Reserva,"id">

const { enderecos } = enderecosInitialState

const initialState: {reservas: Reserva[] } = {
    reservas: []
}
const reservasSlice = createSlice( {
    name:'reserva',
    initialState,
    reducers: {
        addReserva: (state, action : {payload : NewReserva}) => addReservaAction(state.reservas, action.payload),
        updateReserva: (state, action : {payload: Reserva}) => updateReservaAction(state.reservas, action.payload),
        deleteReserva: (state, action : {payload: number}) => deleteReservaAction(state.reservas, action.payload)
    },
    extraReducers: (builder) => {
    builder.addCase(fetchReservas.fulfilled, (_, action) => action.payload)
    }
})

export const { addReserva, deleteReserva, updateReserva } = reservasSlice.actions

export const reservasReducer = reservasSlice.reducer

