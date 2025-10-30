import type z from "zod"
import type { clienteZodSchema, enderecoExtendedZodSchema, enderecoZodSchema, feedbackExtendedZodSchema, feedbackZodSchema, pacoteZodSchema, reservaExtendedZodSchema, reservaZodSchema, roleZodSchema, statusZodSchema } from "./zod-schemas"

export type Role = z.infer<typeof roleZodSchema>
export type Cliente = z.infer<typeof clienteZodSchema>

export type Endereco = z.infer<typeof enderecoZodSchema>
export type EnderecoExtended = z.infer<typeof enderecoExtendedZodSchema>

export type Pacote = z.infer<typeof pacoteZodSchema>

export type Status = z.infer<typeof statusZodSchema>
export type Reserva = z.infer<typeof reservaZodSchema>
export type ReservaExtended = z.infer<typeof reservaExtendedZodSchema>

export type Feedback = z.infer<typeof feedbackZodSchema>
export type FeedbackExtended = z.infer<typeof feedbackExtendedZodSchema>