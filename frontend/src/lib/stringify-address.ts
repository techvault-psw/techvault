import type { Endereco } from "@/redux/endereco/slice"

export const stringifyAddress = (x: Endereco) => {
    let desc = ""
    if(x.description) {
        desc = x.description + " - "
    }

    return x.street + ", " + x.number + " - " + desc + x.neighborhood + ", " + x.city + ", " + x.state
}