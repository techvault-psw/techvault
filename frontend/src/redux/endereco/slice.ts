import { createSlice } from "@reduxjs/toolkit";
import { addAddressAction, deleteAddressAction, updateAddressAction } from "./actions";
import { type Endereco } from '@/consts/enderecos'
import { type Optional } from "@/types/optional";
import { clientes } from "@/consts/clientes";
import { fetchEnderecos } from './fetch.ts'

interface EnderecosState {
    enderecos: Endereco[]
}

export type NewEndereco = Optional<Endereco, 'id'>

export const enderecosInitialState: EnderecosState = {
    enderecos: []
}

const enderecosSlice = createSlice({
    name: 'enderecos',
    initialState: enderecosInitialState,
    reducers: {
        addAddress: (state, action: { payload: NewEndereco }) => addAddressAction(state.enderecos, action.payload),
        updateAddress: (state, action: { payload: Endereco }) => updateAddressAction(state.enderecos, action.payload),
        deleteAddress: (state, action) => deleteAddressAction(state.enderecos, action.payload)
    },
    extraReducers: (builder) => {
      builder.addCase(fetchEnderecos.fulfilled, (_, action) => action.payload)
    }
})

export const { addAddress, updateAddress, deleteAddress } = enderecosSlice.actions

export const enderecosReducer = enderecosSlice.reducer
