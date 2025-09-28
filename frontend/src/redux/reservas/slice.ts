import { createSlice } from "@reduxjs/toolkit";
import { addReservaAction } from "./actions";
import { clientes, type Cliente } from "@/consts/clientes"

export type Reserva = {
    pacoteIndex: number
    valor: number
    status: "Confirmada" | "Cancelada" | "Concluída"
    dataInicio: string
    dataTermino: string
    endereco: string
    codigoEntrega: string
    codigoColeta: string
    cliente: Cliente
    
}

const initialState: {reservas: Reserva[] } = {
    reservas: [
    {
        pacoteIndex: 0,
        valor: 500.00,
        status: "Confirmada",
        dataInicio: new Date("2025-10-01T10:00:00").toISOString(),
        dataTermino: new Date("2025-10-05T10:00:00").toISOString(),
        endereco: "Rua das Flores, 123, São Paulo, SP",
        codigoEntrega: "A7F3K2Z",
        codigoColeta: "9M2XQ8B",
        cliente: clientes[0],
    },
    {
        pacoteIndex: 1,
        valor: 300.00,
        status: "Cancelada",
        dataInicio: new Date("2025-10-10T12:00:00").toISOString(),
        dataTermino: new Date("2025-10-12T12:00:00").toISOString(),
        endereco: "Avenida Brasil, 456, Rio de Janeiro, RJ",
        codigoEntrega: "L4P7R1T",
        codigoColeta: "C6Z8V5Y",
        cliente: clientes[0],
    },
    {
        pacoteIndex: 2,
        valor: 700.00,
        status: "Concluída",
        dataInicio: new Date("2025-09-20T08:00:00").toISOString(),
        dataTermino: new Date("2025-09-25T08:00:00").toISOString(),
        endereco: "Praça Central, 789, Belo Horizonte, MG",
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
        addReserva: (state, action : {payload : Reserva}) => addReservaAction(state.reservas, action.payload),
        updateReserva: (state, action) => {},
        deleteReserva: (state, action) => {}
    }
})

export const { addReserva, deleteReserva, updateReserva } = reservasSlice.actions

export const reservasReducer = reservasSlice.reducer