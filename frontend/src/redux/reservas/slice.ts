import { createSlice } from "@reduxjs/toolkit";

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