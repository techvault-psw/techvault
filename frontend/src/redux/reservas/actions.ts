import type { NewReserva, Reserva } from "./slice";

export const addReservaAction = (reservas: Reserva[], newReserva: NewReserva) => {
    reservas.push({
        ...newReserva,
        id: reservas.length,
    })
}

export const updateReservaAction = (
  reservas: Reserva[],
  updatedReserva: Reserva,
): void => {
  const reservaIndex = reservas.findIndex((reserva) => reserva.id === updatedReserva.id)

  reservas.splice(reservaIndex, 1, updatedReserva)
}

export const deleteReservaAction =  (reservas: Reserva[], reservaID: number) => {
    const reservaIndex = reservas.findIndex((reserva) => reserva.id === reservaID)
    reservas.splice(reservaIndex, 1, {
      ...reservas[reservaIndex],
      status: "Cancelada"
    })
}