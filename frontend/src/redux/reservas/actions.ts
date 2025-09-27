import type { Reserva } from "./slice";

export const addReservaAction = (reservas: Reserva[], newReserva: Reserva) => {
    reservas.push(newReserva)

    //debug:
    console.log(newReserva)
}