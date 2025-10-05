// import { API_URL } from "@/lib/api-url"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { type Reserva, type NewReserva, type NewReservaServer, type ReservaServer } from "./slice"
import { httpDelete, httpGet, httpPost, httpPut } from "@/lib/fetch-utils"
import { differenceInMilliseconds } from "date-fns"
import { gerarCodigo } from "@/lib/gerar-codigo"

// export const fetchReservas = createAsyncThunk("reservas/fetchReservas",
//   async () => {
//     const response = await fetch(`${API_URL}/reservas?_expand=cliente_clienteexpand=pacote&_expand=endereco`)
//     const data = await response.json()
//     return { reservas: data }
//   }
// )

export const fetchReservas = createAsyncThunk<Reserva[]>(`reservas/fetchReservas`,
  async () => {
    return await httpGet("reservas?_expand=cliente&_expand=pacote&_expand=endereco")
  }
)

export const addReservaServer = createAsyncThunk<Reserva, NewReserva>(`reservas/addReservaServer`,
  async (newReserva) => {
    const { cliente, pacote, endereco, ...reservaInfo } = newReserva

    const valorHoraPacote = newReserva.pacote.value
    const dataInicio = new Date(newReserva.dataInicio)
    const dataTermino = new Date(newReserva.dataTermino)
    const horasReserva = differenceInMilliseconds(dataTermino, dataInicio) / (1000 * 60 * 60)
    const valorReserva = valorHoraPacote * horasReserva
  

    const reserva: NewReservaServer = {
      clienteId: newReserva.cliente.id,
      pacoteId: newReserva.pacote.id,
      enderecoId: newReserva.endereco.id,
      ...reservaInfo,
      valor: valorReserva,
      codigoEntrega: gerarCodigo(),
      codigoColeta: gerarCodigo(),
    }
    return await httpPost('/reservas', reserva)
  }
)

export const updateReservaServer = createAsyncThunk<Reserva, Reserva>('reservas/updateReservaServer ',
  async (reserva) => {
    const { cliente, pacote, endereco, ...reservaInfo } = reserva
    const updatedReserva: ReservaServer = {
      clienteId: reserva.cliente.id,
      pacoteId: reserva.pacote.id,
      enderecoId: reserva.endereco.id,
      ...reservaInfo
    }

    return await httpPut(`/reservas/${reserva.id}`, updatedReserva)
  }
)
export const cancelReservaServer = createAsyncThunk<Reserva, Reserva>('reservas/cancelReservaServer ',
  async (reserva) => {
    const { cliente, pacote, endereco, ...reservaInfo } = reserva
    const updatedReserva: ReservaServer = {
      clienteId: reserva.cliente.id,
      pacoteId: reserva.pacote.id,
      enderecoId: reserva.endereco.id,
      ...reservaInfo,
      status: "Cancelada"
    }

    return await httpPut(`/reservas/${reserva.id}`, updatedReserva)
  }
)
