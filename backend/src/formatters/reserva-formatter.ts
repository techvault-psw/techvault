import type { Reserva, ReservaExtended } from "../consts/types";
import { ClienteFormatter } from "./cliente-formatter";
import { PacoteFormatter } from "./pacote-formatter";
import { EnderecoFormatter } from "./endereco-formatter";
import { PopulatedReservaSchema, ReservaSchema } from "../models/reserva";

export function ReservaFormatter(reserva: ReservaSchema): Reserva {
  return {
    id: reserva._id.toString(),
    clienteId: reserva.clienteId.toString(),
    pacoteId: reserva.pacoteId.toString(),
    enderecoId: reserva.enderecoId.toString(),
    valor: reserva.valor,
    status: reserva.status,
    dataInicio: reserva.dataInicio.toISOString(),
    dataTermino: reserva.dataTermino.toISOString(),
    dataEntrega: reserva.dataEntrega?.toISOString(),
    dataColeta: reserva.dataColeta?.toISOString(),
    codigoEntrega: reserva.codigoEntrega,
    codigoColeta: reserva.codigoColeta,
  }
}

export function PopulatedReservaFormatter(reserva: PopulatedReservaSchema): ReservaExtended {
  return {
    id: reserva._id.toString(),
    clienteId: reserva.clienteId._id.toString(),
    cliente: ClienteFormatter(reserva.clienteId),
    pacoteId: reserva.pacoteId._id.toString(),
    pacote: PacoteFormatter(reserva.pacoteId),
    enderecoId: reserva.enderecoId._id.toString(),
    endereco: EnderecoFormatter(reserva.enderecoId),
    valor: reserva.valor,
    status: reserva.status,
    dataInicio: reserva.dataInicio.toISOString(),
    dataTermino: reserva.dataTermino.toISOString(),
    dataEntrega: reserva.dataEntrega?.toISOString(),
    dataColeta: reserva.dataColeta?.toISOString(),
    codigoEntrega: reserva.codigoEntrega,
    codigoColeta: reserva.codigoColeta,
  }
}