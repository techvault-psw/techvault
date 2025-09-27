import type { Endereco } from "@/consts/enderecos";
import type { NewEndereco } from "./slice";

interface AddAddressActionParams {
    enderecos: Endereco[],
    newEndereco: Endereco
}

export const addAddressAction = (enderecos: Endereco[], newEndereco: NewEndereco) => {
    enderecos.push({
        ...newEndereco,
        id: enderecos.length
    })

    console.log(newEndereco)
}

export const updateAddressAction = (enderecos: Endereco[], newEndereco: Endereco) => {
    enderecos.splice(newEndereco.id, 1, newEndereco)
}

export const deleteAddressAction = (enderecos: Endereco[], id: number) => {
    enderecos.splice(id, 1)
}