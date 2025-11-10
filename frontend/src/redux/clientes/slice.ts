import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { addClienteServer, deleteClienteServer, fetchClientes, updateClienteServer } from "./fetch";
import type { Optional } from "@/types/optional";
import type { InitialState, RootState } from "../root-reducer";

export type Cliente = {
  id: string
  name: string
  email: string
  phone: string
  registrationDate: string
  password: string
  role: "Cliente" | "Gerente" | "Suporte"; 
}
export type NewCliente = Optional<Cliente, 'id'>

export type ClienteServer = Cliente

export type NewClienteServer = Optional<ClienteServer, 'id'>

const clientesAdapter = createEntityAdapter<Cliente>()

const clienteInitialState = clientesAdapter.getInitialState<InitialState & { clienteAtual?: Cliente}>({
  status: 'not_loaded',
  error: null,
  clienteAtual: undefined
})

const clienteSlice = createSlice({
  name: "cliente",
  initialState: clienteInitialState,
  reducers: {
    loginCliente: (state, action: PayloadAction<Pick<Cliente, "email" | "password">>) => {
      const clientePayload = action.payload
      const { email, password } = clientePayload

      const cliente = Object.values(state.entities).find(cliente => cliente.email === email && cliente.password === password);
      if (cliente) {
        state.clienteAtual = cliente;
      } 
    },
    
    logoutCliente: (state) => {
      state.clienteAtual = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientes.pending,         (state, action) => { state.status = 'loading' })
      .addCase(fetchClientes.fulfilled,       (state, action) => { state.status = 'loaded'; clientesAdapter.setAll(state, action.payload) })
      .addCase(fetchClientes.rejected,        (state, action) => { state.status = 'failed'; state.error = 'Falha ao buscar clientes!' })
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

export const { loginCliente, logoutCliente } = clienteSlice.actions;
export const clienteReducer = clienteSlice.reducer;

export const {
  selectAll: selectAllClientes,
  selectById: selectClienteById,
  selectIds: selectClientesIds,
} = clientesAdapter.getSelectors((reducer: RootState) => reducer.clienteReducer)