import type { NewReserva, Reserva } from "./slice";

export const addReservaAction = (reservas: Reserva[], newReserva: NewReserva) => {
    reservas.push({
        ...newReserva,
        id: reservas.length,
    })

    //debug:
    console.log(newReserva)
}


export const deleteReservaAction =  (reservas: Reserva[], reservaID: number) => {
    const reservaIndex = reservas.findIndex((reserva) => reserva.id === reservaID)
    reservas.splice(reservaIndex, 1)
}