import mongoose, { Schema, Types, type HydratedDocument, type HydratedDocumentFromSchema } from "mongoose";
import type { ClienteSchema } from "./cliente";
import type { PacoteSchema } from "./pacote";

const feedbackSchema = new Schema({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comentario: {
    type: String,
    required: true,
    minlength: 10,
  },
})

export const feedbacks = mongoose.model('feedback', feedbackSchema)

export type FeedbackSchema = HydratedDocumentFromSchema<typeof feedbackSchema>

export type PopulatedFeedbackSchema = HydratedDocument<
  FeedbackSchema,
  {
    clienteId: ClienteSchema
    pacoteId: PacoteSchema
  }
>
