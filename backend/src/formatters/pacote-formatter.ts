import type { Pacote } from "../consts/types";
import type { PacoteSchema } from "../models/pacote";

export function PacoteFormatter(pacote: PacoteSchema): Pacote {
  return {
    id: pacote._id.toString(),
    name: pacote.name,
    image: pacote.image,
    description: pacote.description,
    components: pacote.components,
    value: pacote.value,
    quantity: pacote.quantity,
  }
}