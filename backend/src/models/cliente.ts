import mongoose, { Schema, type HydratedDocumentFromSchema } from "mongoose";

const clienteSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  password: {
    type: String,
    required: true,
    trim:true,
    min: 1,
  },
  role: {
    type: String,
    required: true,
    enum: ['Cliente','Gerente','Suporte'],
  }
})

export const clientes = mongoose.model('cliente', clienteSchema)

export type ClienteSchema = HydratedDocumentFromSchema<typeof clienteSchema>