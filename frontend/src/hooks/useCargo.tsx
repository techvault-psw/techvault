import { useEffect, useState } from "react"

interface useCargoReturn {
    cargo: string,
    setCargo: (novoCargo: string) => void
    isGerente: () => boolean,
    isSuporte: () => boolean
}

export default function useCargo(): useCargoReturn {
    const [cargo, setCargoState] = useState(() => {
        if(typeof window !== "undefined") {
            return localStorage.getItem("cargo") || ""
        }
        return ""
    })

    const setCargo = (novoCargo: string) => {
        localStorage.setItem("cargo", novoCargo)
    }

    const isGerente = () => {
        return localStorage.getItem("cargo") == "gerente"
    }

    const isSuporte = () => {
        return localStorage.getItem("cargo") == "suporte"
    }

    useEffect(() => {
        const handleStorage = (event: StorageEvent) => {
        if (event.key == "cargo") {
            setCargoState(event.newValue || "");
        }
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    return {cargo, setCargo, isGerente, isSuporte}
}