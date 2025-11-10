import z from "zod";

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  message: "ID inválido. Deve ser um ObjectId do MongoDB"
})

export const roleZodSchema = z.enum(["Cliente", "Gerente", "Suporte"])

export const clienteZodSchema = z.object({
  id: objectIdSchema,
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  registrationDate: z.iso.datetime(),
  password: z.string(),
  role: roleZodSchema,
})

export const enderecoZodSchema = z.object({
  id: objectIdSchema,
  clienteId: objectIdSchema,
  name: z.string(),
  cep: z.string(),
  street: z.string(),
  number: z.string(),
  description: z.string().nullish(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string().length(2),
})

export const enderecoExtendedZodSchema = enderecoZodSchema.extend({
  cliente: clienteZodSchema,
})

export const pacoteZodSchema = z.object({
  id: objectIdSchema,
  name: z.string().trim(),
  image: z.string().url(),
  description: z.array(z.string().trim().min(10)).min(1),
  components: z.array(z.string().trim()),
  value: z.number().positive(),
  quantity: z.number().int().min(0),
})

export const statusZodSchema = z.enum(["Confirmada", "Cancelada", "Concluída"])

export const reservaZodSchema = z.object({
  id: objectIdSchema,
  clienteId: objectIdSchema,
  pacoteId: objectIdSchema,
  enderecoId: objectIdSchema,
  valor: z.number(),
  status: statusZodSchema,
  dataInicio: z.iso.datetime(),
  dataTermino: z.iso.datetime(),
  dataEntrega: z.iso.datetime().nullish(),
  dataColeta: z.iso.datetime().nullish(),
  codigoEntrega: z.string().length(7),
  codigoColeta: z.string().length(7),
})

export const reservaExtendedZodSchema = reservaZodSchema.extend({
  cliente: clienteZodSchema,
  pacote: pacoteZodSchema,
  endereco: enderecoZodSchema,
})

export const feedbackZodSchema = z.object({
  id: objectIdSchema,
  clienteId: objectIdSchema,
  pacoteId: objectIdSchema,
  rating: z.number().min(1).max(5),
  comentario: z.string().min(10),
})

export const feedbackExtendedZodSchema = feedbackZodSchema.extend({
  cliente: clienteZodSchema,
  pacote: pacoteZodSchema,
})
