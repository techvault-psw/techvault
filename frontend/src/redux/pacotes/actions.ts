import type { Pacote, NewPacote } from "./slice";

export const addPackageAction = (
  pacotes: Pacote[],
  newPacote: NewPacote
) => {
  pacotes.push({
    ...newPacote,
    id: pacotes.length,
  })
}

export const updatePackageAction = (
  pacotes: Pacote[],
  updatedPacote: Pacote,
): void => {
  const pacoteIndex = pacotes.findIndex((pacote) => pacote.id === updatedPacote.id)

  pacotes.splice(pacoteIndex, 1, updatedPacote)
}

export const deletePackageAction = (pacotes: Pacote[], id: number) => {
  const pacoteIndex = pacotes.findIndex((pacote) => pacote.id === id)

  pacotes.splice(pacoteIndex, 1)
}