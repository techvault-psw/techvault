import { createSlice } from "@reduxjs/toolkit";
import { addReservaAction, deleteReservaAction, updateReservaAction } from "./actions";
import { clientes, type Cliente } from "@/consts/clientes"
import type { Optional } from "@/types/optional";
import type { Pacote } from "../pacotes/slice";
import { pacotes } from "@/consts/pacotes";
import { enderecosInitialState } from "../endereco/slice";
import type { Endereco } from "@/consts/enderecos";

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
    reservas: [
    {
        id: 0,
        pacote: pacotes[0],
        valor: 500.00,
        status: "Confirmada",
        dataInicio: new Date("2025-10-01T10:00:00").toISOString(),
        dataTermino: new Date("2025-10-05T10:00:00").toISOString(),
        endereco: enderecos[0],
        codigoEntrega: "A7F3K2Z",
        codigoColeta: "9M2XQ8B",
        cliente: clientes[0],
    },
    {
        id: 1,
        pacote: pacotes[1],
        valor: 300.00,
        status: "Cancelada",
        dataInicio: new Date("2025-10-10T12:00:00").toISOString(),
        dataTermino: new Date("2025-10-12T12:00:00").toISOString(),
        endereco: enderecos[1],
        codigoEntrega: "L4P7R1T",
        codigoColeta: "C6Z8V5Y",
        cliente: clientes[0],
    },
    {
        id: 2,
        pacote: pacotes[2],
        valor: 700.00,
        status: "Concluída",
        dataInicio: new Date("2025-09-20T08:00:00").toISOString(),
        dataTermino: new Date("2025-09-25T08:00:00").toISOString(),
        endereco: enderecos[2],
        codigoEntrega: "Q3N9W0K",
        codigoColeta: "H2B7D6M",
        cliente: clientes[0],
    }
    ]
}
const reservasSlice = createSlice( {
    name:'reserva',
    initialState,
    reducers: {
        addReserva: (state, action : {payload : NewReserva}) => addReservaAction(state.reservas, action.payload),
        updateReserva: (state, action : {payload: Reserva}) => updateReservaAction(state.reservas, action.payload),
        deleteReserva: (state, action : {payload: number}) => deleteReservaAction(state.reservas, action.payload)
    }
})

export const { addReserva, deleteReserva, updateReserva } = reservasSlice.actions

export const reservasReducer = reservasSlice.reducer