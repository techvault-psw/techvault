const lorem = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur atque, et repellendus eaque repudiandae accusamus aliquam libero tenetur!"

export type Feedback = {
    cliente: String
    nota: number
    descricao: string
    pacoteIndex: number
}

export const feedbacks: Feedback[] = [
    {
        cliente: "João Silva",
        pacoteIndex: 0,
        nota: 4,
        descricao: lorem,
    },
    {
        cliente: "Maria Fernandes",
        pacoteIndex: 1,
        nota: 3,
        descricao: lorem,
    },
    {
        cliente: "Diogo Mendonça",
        pacoteIndex: 2,
        nota: 5,
        descricao: lorem,
    },
    {
    
        cliente: "Roberto Johnson",
        pacoteIndex: 1,
        nota: 4,
        descricao: lorem,
    },
];