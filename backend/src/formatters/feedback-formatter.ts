import type { Feedback, FeedbackExtended } from "../consts/types";
import type { FeedbackSchema, PopulatedFeedbackSchema } from "../models/feedback";
import { ClienteFormatter } from "./cliente-formatter";
import { PacoteFormatter } from "./pacote-formatter";

export function FeedbackFormatter(feedback: FeedbackSchema): Feedback {
  return {
    id: feedback._id.toString(),
    clienteId: feedback.clienteId.toString(),
    pacoteId: feedback.pacoteId.toString(),
    comentario: feedback.comentario,
    rating: feedback.rating,
  }
}

export function PopulatedFeedbackFormatter(feedback: PopulatedFeedbackSchema): FeedbackExtended {
  return {
    id: feedback._id.toString(),
    clienteId: feedback.clienteId._id.toString(),
    cliente: ClienteFormatter(feedback.clienteId),
    pacoteId: feedback.pacoteId._id.toString(),
    pacote: PacoteFormatter(feedback.pacoteId),
    comentario: feedback.comentario,
    rating: feedback.rating,
  }
}