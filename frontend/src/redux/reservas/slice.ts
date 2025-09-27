import { createSlice } from "@reduxjs/toolkit";

export type Reserva = {
    pacoteIndex: number
    valor: number
    status: "Confirmada" | "Cancelada" | "Concluída"
    dataInicio: Date
    dataTermino: Date
    endereco: string
    codigoEntrega: string
    codigoColeta: string
}

const initialState = {
    reservas: []
}
const reservasSlice = createSlice( {
    name:'feedback',
    initialState,
    reducers: {
        addReserva: (state, action) => {},
        updateReserva: (state, action) => {},
        deleteReserva: (state, action) => {}
    }
})