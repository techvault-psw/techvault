import type { RootState } from "@/redux/root-reducer"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

interface useCargoReturn {
    cargo: string,
    isGerente: () => boolean,
    isSuporte: () => boolean
}

export default function useCargo(): useCargoReturn {
    const { clienteAtual } = useSelector((state: RootState) => state.clienteReducer)

    const [cargo, _] = useState(() => {
        if(typeof window !== "undefined") {
            return clienteAtual?.role || ""
        }
        return ""
    })

    const isGerente = () => {
        return clienteAtual?.role.toLocaleLowerCase() == "gerente"
    }

    const isSuporte = () => {
        return clienteAtual?.role.toLocaleLowerCase() == "suporte"
    }

    return {cargo, isGerente, isSuporte}
}