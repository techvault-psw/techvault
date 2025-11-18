import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { addClienteServer, deleteClienteServer, fetchClientes, loginServer, updateClienteServer } from "./fetch";
import type { Optional } from "@/types/optional";
import type { InitialState, RootState } from "../root-reducer";
import { jwtDecode } from "jwt-decode";
import { isTokenExpired } from "@/lib/token-utils";

export type Role = "Cliente" | "Gerente" | "Suporte";

export type Cliente = {
  id: string
  name: string
  email: string
  phone: string
  registrationDate: string
  password: string
  role: Role
}

export type NewCliente = Optional<Cliente, 'id'>

export type ClienteServer = Cliente

export type NewClienteServer = Optional<ClienteServer, 'id'>

const clientesAdapter = createEntityAdapter<Cliente>()

const clienteInitialState = clientesAdapter.getInitialState<InitialState & { clienteAtual?: Cliente; token?: string }>({
  status: 'not_loaded',
  error: null,
  clienteAtual: undefined,
  token: undefined,
})

function setClienteAtualFromToken(state: typeof clienteInitialState) {
  if (!state.token) return
  
  if (isTokenExpired(state.token)) {
    state.token = undefined;
    state.clienteAtual = undefined;
    return;
  }
  
  try {
    const { id } = jwtDecode<{ id: string; role: Role }>(state.token)
    const cliente = Object.values(state.entities).find(c => c.id === id)
    state.clienteAtual = cliente
  } catch (err) {
    console.error('Erro ao decodificar token:', err)
    state.token = undefined;
    state.clienteAtual = undefined
  }
}

const clienteSlice = createSlice({
  name: "cliente",
  initialState: clienteInitialState,
  reducers: {
    logoutCliente: (state) => {
      state.token = undefined;
      state.clienteAtual = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientes.pending,         (state, action) => { state.status = 'loading' })
      .addCase(fetchClientes.fulfilled,       (state, action) => {
        state.status = 'loaded';
        clientesAdapter.setAll(state, action.payload)
        setClienteAtualFromToken(state)
      })
      .addCase(fetchClientes.rejected,        (state, action) => { state.status = 'failed'; state.error = 'Falha ao buscar clientes!' })
      .addCase(loginServer.fulfilled,         (state, action) => {
        state.token = action.payload.token
        setClienteAtualFromToken(state)
      })
      .addCase(addClienteServer.pending,      (state, action) => { state.status = 'saving' })
      .addCase(addClienteServer.fulfilled,    (state, action) => { state.status = 'saved';  clientesAdapter.addOne(state, action.payload) })
      .addCase(addClienteServer.rejected,     (state, action) => { state.status = 'failed'; state.error = 'Falha ao adicionar cliente!' })
      .addCase(updateClienteServer.pending,   (state, action) => { state.status = 'saving' })
      .addCase(updateClienteServer.fulfilled, (state, action) => { state.status = 'saved';  clientesAdapter.upsertOne(state, action.payload) })
      .addCase(updateClienteServer.rejected,  (state, action) => { state.status = 'failed'; state.error = 'Falha ao atualizar cliente!' })
      .addCase(deleteClienteServer.pending,   (state, action) => { state.status = 'deleting' })
      .addCase(deleteClienteServer.fulfilled, (state, action) => { state.status = 'deleted'; clientesAdapter.removeOne(state, action.payload) })
      .addCase(deleteClienteServer.rejected,  (state, action) => { state.status = 'failed';  state.error = 'Falha ao excluir cliente!' })
  } 
});

export const { logoutCliente } = clienteSlice.actions;
export const clienteReducer = clienteSlice.reducer;

export const {
  selectAll: selectAllClientes,
  selectById: selectClienteById,
  selectIds: selectClientesIds,
} = clientesAdapter.getSelectors((reducer: RootState) => reducer.clienteReducer)