import { createAsyncThunk } from "@reduxjs/toolkit"
import { type Reserva, type NewReserva, type ReservaServer } from "./slice"
import { httpGet, httpPatch, httpPost, httpPut } from "@/lib/fetch-utils"

export const fetchReservas = createAsyncThunk<Reserva[]>(`reservas/fetchReservas`,
  async () => {
    return await httpGet("reservas")
  }
)

export const addReservaServer = createAsyncThunk<Reserva, NewReserva>(`reservas/addReservaServer`,
  async (newReserva) => {
    const { cliente, pacote, endereco, dataInicio, dataTermino } = newReserva

    return await httpPost('/reservas', {
      clienteId: cliente.id,
      pacoteId: pacote.id,
      enderecoId: endereco.id,
      dataInicio,
      dataTermino,
    })
  }
)

export const updateReservaServer = createAsyncThunk<Reserva, Reserva>('reservas/updateReservaServer ',
  async (reserva) => {
    const { dataEntrega, dataColeta, dataInicio, dataTermino, codigoColeta, codigoEntrega, status } = reserva

    return await httpPut(`/reservas/${reserva.id}`, {
      dataEntrega,
      dataColeta,
      dataInicio,
      dataTermino,
      codigoColeta,
      codigoEntrega,
      status,
    })
  }
)

export const entregarReservaServer = createAsyncThunk<Reserva, { reserva: Reserva; codigoEntrega: string }>('reservas/entregarReservaServer ',
  async ({ reserva, codigoEntrega }) => {
    return await httpPatch(`/reservas/${reserva.id}/confirmar-entrega`, { codigoEntrega })
  }
)

export const coletarReservaServer = createAsyncThunk<Reserva, { reserva: Reserva; codigoColeta: string }>('reservas/coletarReservaServer ',
  async ({ reserva, codigoColeta }) => {
    return await httpPatch(`/reservas/${reserva.id}/confirmar-coleta`, { codigoColeta })
  }
)

export const cancelReservaServer = createAsyncThunk<Reserva, Reserva>('reservas/cancelReservaServer ',
  async (reserva) => {
    return await httpPatch(`/reservas/${reserva.id}/cancelar-reserva`, undefined)
  }
)
