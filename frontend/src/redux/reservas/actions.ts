import type { Reserva } from "./slice";

export const addReservaAction = (reservas: Reserva[], newReserva: NewReserva) => {
    reservas.push({
        ...newReserva,
        id: reservas.length,
    })

    //debug:
    console.log(newReserva)
}