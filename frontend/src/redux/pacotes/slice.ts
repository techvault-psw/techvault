import { createSlice } from "@reduxjs/toolkit";
import { addPackageAction, deletePackageAction, updatePackageAction } from "./actions";
import { type Optional } from "@/types/optional";
import { fetchPacotes } from "./fetch";

interface PacoteState {
  pacotes: Pacote[]
}

export type Pacote = {
  id: number
  name: string
  image: string
  description: string[]
  components: string[]
  value: number
  quantity: number
}

export type NewPacote = Optional<Pacote, 'id'>

const pacotesInitialState: PacoteState = {
  pacotes: []
}

const pacotesSlice = createSlice({
  name: 'pacotes',
  initialState: pacotesInitialState,
  reducers: {
    addPackage: ({ pacotes }, action: { payload: NewPacote }) => addPackageAction(pacotes, action.payload),
    updatePackage: ({ pacotes }, action: { payload: Pacote }) => updatePackageAction(pacotes, action.payload),
    deletePackage: ({ pacotes }, action: {payload: number}) => deletePackageAction(pacotes, action.payload)
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPacotes.fulfilled, (_, action) =>action.payload)
  }
})

export const { addPackage, deletePackage, updatePackage } = pacotesSlice.actions

export const pacotesReducer = pacotesSlice.reducer