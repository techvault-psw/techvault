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
    const addressIndex = enderecos.findIndex((endereco) => endereco.id == newEndereco.id)
    enderecos.splice(addressIndex, 1, newEndereco)
}

export const deleteAddressAction = (enderecos: Endereco[], id: number) => {
    const addressIndex = enderecos.findIndex((endereco) => endereco.id == id)
    enderecos.splice(addressIndex, 1)
}