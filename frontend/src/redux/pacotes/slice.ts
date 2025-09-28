import { createSlice } from "@reduxjs/toolkit";
import { addPackageAction, deletePackageAction, updatePackageAction } from "./actions";
import { type Optional } from "@/types/optional";

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
}

export type NewPacote = Optional<Pacote, 'id'>

const pacotesInitialState: PacoteState = {
  pacotes: [
    {
      id: 0,
      name: 'Setup Gamer Duplo',
      image: 'setup-1.png',
      description: [
        'Pacote com 2 PCs de última geração com monitores duplos, cadeiras ergonômicas e periféricos gamer de alta performance. Ideal para jogatinas com amigos.'
      ],
      components: [
        'Ryzen 5 5600',
        'RTX 3060 12GB',
        '16 GB RAM DDR4',
        'SSD NVMe 1 TB',
        'Placa-mãe compatível',
      ],
      value: 200,
    },
    {
    id: 1,
    name: 'Setup de Trabalho Profissional',
    image: 'setup-2.png',
    description: [
      'Pacote ideal para profissionais que precisam de desempenho e conforto no dia a dia. Conta com notebook de alto desempenho, monitor auxiliar para multitarefas, cadeira ergonômica e iluminação adequada para videoconferências.'
    ],
    components: [
      'Notebook i7 12ª geração',
      'Monitor 27” Full HD',
      'Cadeira ergonômica com ajuste lombar',
      'Kit teclado e mouse sem fio',
      'Luminária de mesa com LED ajustável',
      'Headset com microfone profissional',
    ],
    value: 100,
    },
    {
    id: 2,
    name: 'Setup Gamer Squad',
    image: 'setup-3.png',
    description: [
      'Pacote completo para equipes colaborarem juntas em um ambiente de trabalho moderno e produtivo. Inclui múltiplas estações de trabalho, ergonomia, periféricos e suporte para reuniões em grupo.'
    ],
    components: [
      '4 Notebooks i5 12ª geração',
      '4 Monitores 27” Full HD',
      '4 Cadeiras ergonômicas',
      '4 Kits teclado e mouse sem fio',
      'Mesa compartilhada ampla',
    ],
    value: 400,
    },
  ]
}

const pacotesSlice = createSlice({
  name: 'enderecos',
  initialState: pacotesInitialState,
  reducers: {
    addPackage: ({ pacotes }, action: { payload: NewPacote }) => addPackageAction(pacotes, action.payload),
    updatePackage: ({ pacotes }, action: { payload: Pacote }) => updatePackageAction(pacotes, action.payload),
    deletePackage: ({ pacotes }, action: {payload: number}) => deletePackageAction(pacotes, action.payload)
  }
})

export const { addPackage, deletePackage, updatePackage } = pacotesSlice.actions

export const pacotesReducer = pacotesSlice.reducer