import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Cliente } from "@/consts/clientes";
import { clientes } from "@/consts/clientes";

type ClienteState = {
  clientes: Cliente[];
  clienteSelecionado?: Cliente;
};

const initialState: ClienteState = {
  clientes: clientes,
  clienteSelecionado: undefined,
};

const clienteSlice = createSlice({
  name: "cliente",
  initialState,
  reducers: {
    addCliente: (state, action: PayloadAction<Cliente>) => {
      state.clientes.push(action.payload);
    },
    updateCliente: (state, action: PayloadAction<Cliente>) => {
      const index = state.clientes.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.clientes[index] = action.payload;
      }
    },
    deleteCliente: (state, action: PayloadAction<number>) => {
      state.clientes = state.clientes.filter(c => c.id !== action.payload);
    },
  },
});

export const { addCliente, updateCliente, deleteCliente } = clienteSlice.actions;

export const clienteReducer = clienteSlice.reducer;