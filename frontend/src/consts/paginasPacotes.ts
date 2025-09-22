import type { Pacote } from "./pacotes"
import { pacotes } from "./pacotes"

export type PaginaPacote = {
    pacote: Pacote
    pagina: string
}


export const paginasPacotes: PaginaPacote[] = [
    {
        pacote: pacotes[0],
        pagina: "info-gamer-duplo"
    },
    {
        pacote: pacotes[1],
        pagina: "info-trabalho-pro"
    },
    {
        pacote: pacotes[2],
        pagina: "info-gamer-squad"
    }
]