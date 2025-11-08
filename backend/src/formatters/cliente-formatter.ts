import type { Cliente } from "../consts/types";
import type { ClienteSchema } from "../models/cliente";

export function ClienteFormatter(cliente: ClienteSchema): Cliente {
  return {
    id: cliente._id.toString(),
    name: cliente.name,
    email: cliente.email,
    phone: cliente.phone,
    registrationDate: cliente.registrationDate.toISOString(),
    password: cliente.password,
    role: cliente.role,
  }
}