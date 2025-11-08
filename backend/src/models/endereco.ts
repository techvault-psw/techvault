import mongoose, { Schema, Types, type HydratedDocument, type HydratedDocumentFromSchema } from "mongoose";
import type { ClienteSchema } from "./cliente";

const enderecoSchema = new Schema({
  clienteId: {
    type: Types.ObjectId,
    ref: "cliente",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  cep: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  neighborhood: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    length: 2,
    required: true,
  }
})

export const enderecos = mongoose.model('endereco', enderecoSchema)

export type EnderecoSchema = HydratedDocumentFromSchema<typeof enderecoSchema>

export type PopulatedEnderecoSchema = HydratedDocument<
  EnderecoSchema,
  {
    clienteId: ClienteSchema
  }
>
