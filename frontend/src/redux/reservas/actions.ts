import { differenceInMilliseconds } from "date-fns";
import type { NewReserva, Reserva } from "./slice";

const gerarCodigo = () => {
  let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let digits = "0123456789"
  let code = "";

  for (let i = 0; i < 7; i++) {
    if (i % 2 == 0) {
      code += letters[Math.floor(Math.random() * 26)];
    } else {
      code += digits[Math.floor(Math.random() * 10)];
    }
  }
  return code;
};

export const addReservaAction = (reservas: Reserva[], newReserva: NewReserva) => {
  const valorHoraPacote = newReserva.pacote.value
  const dataInicio = new Date(newReserva.dataInicio)
  const dataTermino = new Date(newReserva.dataTermino)
  const horasReserva = differenceInMilliseconds(dataTermino, dataInicio) / (1000 * 60 * 60)
  const valorReserva = valorHoraPacote * horasReserva

  reservas.push({
    ...newReserva,
    id: reservas.length,
    codigoEntrega: gerarCodigo(),
    codigoColeta: gerarCodigo(),
    valor: valorReserva,
  })
}

export const updateReservaAction = (
  reservas: Reserva[],
  updatedReserva: Reserva,
): void => {
  const reservaIndex = reservas.findIndex((reserva) => reserva.id === updatedReserva.id)

  reservas.splice(reservaIndex, 1, updatedReserva)
}

export const deleteReservaAction = (reservas: Reserva[], reservaID: number) => {
  const reservaIndex = reservas.findIndex((reserva) => reserva.id === reservaID)
  reservas.splice(reservaIndex, 1, {
    ...reservas[reservaIndex],
    status: "Cancelada"
  })
}
