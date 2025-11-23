import mongoose, { Schema, Types, type HydratedDocument, type HydratedDocumentFromSchema } from "mongoose";
import type { ClienteSchema } from "./cliente";
import type { PacoteSchema } from "./pacote";
import type { EnderecoSchema } from "./endereco";

const reservaSchema = new Schema({
  clienteId: {
    type: Types.ObjectId,
    ref: "cliente",
    required: true,
  },
  pacoteId: {
    type: Types.ObjectId,
    ref: "pacote",
    required: true,
  },
  enderecoId: {
    type: Types.ObjectId,
    ref: "endereco",
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  metodoPagamento: {
    type: String,
    enum: ["Cartão de Crédito", "Cartão de Débito", "Pix"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Confirmada", "Cancelada", "Concluída"],
    required: true,
  },
  dataInicio: {
    type: Date,
    required: true,
  },
  dataTermino: {
    type: Date,
    required: true,
  },
  dataEntrega: {
    type: Date,
    required: false,
  },
  dataColeta: {
    type: Date,
    required: false,
  },
  codigoEntrega: {
    type: String,
    length: 7,
    required: true,
  },
  codigoColeta: {
    type: String,
    length: 7,
    required: true,
  },
})

export const reservas = mongoose.model('reserva', reservaSchema)

export type ReservaSchema = HydratedDocumentFromSchema<typeof reservaSchema>

export type PopulatedReservaSchema = HydratedDocument<
  ReservaSchema,
  {
    clienteId: ClienteSchema
    pacoteId: PacoteSchema
    enderecoId: EnderecoSchema
  }
>
