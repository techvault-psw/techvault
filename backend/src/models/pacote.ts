import mongoose, { Schema, type HydratedDocumentFromSchema } from "mongoose";

const pacoteSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: [{
    type: String,
    required: true,
    trim: true,
    minlength: 15,
  }],
  components: [{
    type: String,
    required: true,
    trim: true,
  }],
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  }
})

export const pacotes = mongoose.model('pacote', pacoteSchema)

export type PacoteSchema = HydratedDocumentFromSchema<typeof pacoteSchema>