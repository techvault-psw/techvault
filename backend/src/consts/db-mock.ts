import type { Cliente, Endereco, Feedback, Pacote, Reserva } from "./types"

export const clientes: Cliente[] = []

export const enderecos: Endereco[] = []

export const pacotes: Pacote[] = [
  {
    id: "669186d6-1224-474a-8092-2ddedfb268ee",
    name: "Setup Gamer Duplo",
    image: "https://i.ibb.co/63yjYjZ/setup-1.png",
    description: [
      "Pacote com 2 PCs de última geração com monitores duplos, cadeiras ergonômicas e periféricos gamer de alta performance. Ideal para jogatinas com amigos."
    ],
        components: [
      "Ryzen 5 5600",
      "RTX 3060 12GB",
      "16 GB RAM DDR4",
      "SSD NVMe 1 TB",
      "Placa-mãe compatível"
    ],
    value: 200,
    quantity: 3,
  },
  {
    id: "0348dba9-264f-40d1-aa63-22310eb3b62a",
    name: "Setup de Trabalho Profissional",
    image: "https://i.ibb.co/TMZM644c/setup-2.png",
    description: [
      "Pacote ideal para profissionais que precisam de desempenho e conforto no dia a dia. Conta com notebook de alto desempenho, monitor auxiliar para multitarefas, cadeira ergonômica e iluminação adequada para videoconferências."
    ],
        components: [
      "Notebook i7 12ª geração",
      "Monitor 27\" Full HD",
      "Cadeira ergonômica com ajuste lombar",
      "Kit teclado e mouse sem fio",
      "Luminária de mesa com LED ajustável",
      "Headset com microfone profissional"
    ],
    value: 100,
    quantity: 5,
  },
  {
    id: "dcd6e301-2560-48a1-9135-92bd3f0c2401",
    name: "Setup Gamer Squad",
    image: "https://i.ibb.co/rRXqS6RN/setup-3.png",
    description: [
      "Pacote completo para equipes colaborarem juntas em um ambiente de trabalho moderno e produtivo. Inclui múltiplas estações de trabalho, ergonomia, periféricos e suporte para reuniões em grupo."
    ],
        components: [
      "4 Notebooks i5 12ª geração",
      "4 Monitores 27\" Full HD",
      "4 Cadeiras ergonômicas",
      "4 Kits teclado e mouse sem fio",
      "Mesa compartilhada ampla"
    ],
    value: 400,
    quantity: 2,
  },
  {
    id: "5999ec22-664f-4e98-b8f0-e76e80cfd182",
    name: "Setup Gamer Ultimate",
    image: "https://i.ibb.co/5xxqZMc8/setup-8.png",
    description: [
      "Para gamers exigentes que buscam desempenho máximo em jogos de última geração, com gráficos ultra e fluidez impressionante."
    ],
        components: [
      "Intel i9 13900K",
      "RTX 4090 24GB",
      "64 GB RAM DDR5",
      "SSD NVMe 2 TB",
      "Placa-mãe Z790",
      "Cadeira gamer premium",
      "Monitor 32\" 4K 144Hz"
    ],
    value: 600,
    quantity: 1,
  },
  {
    id: "352f4dac-5cf1-4a16-a4a2-abb372c26fd7",
    name: "Setup Casual Essencial",
    image: "https://i.ibb.co/d40k04kZ/setup-5.png",
    description: [
      "Pacote compacto para quem busca um setup simples e funcional para o dia a dia. Ideal para estudos, navegação e uso doméstico."
    ],
        components: [
      "Notebook i5 10ª geração",
      "Monitor 24\" Full HD",
      "Cadeira simples acolchoada",
      "Teclado e mouse USB"
    ],
    value: 80,
    quantity: 6,
  },
  {
    id: "f5b186a8-d9dd-45ad-a97b-16a03f85c0e0",
    name: "Setup Criativo Designer",
    image: "https://i.ibb.co/dwtvw26s/setup-6.png",
    description: [
      "Pensado para designers e criativos que trabalham com softwares gráficos exigentes. Conta com tela de alta resolução e acessórios de precisão."
    ],
        components: [
      "MacBook Pro M1",
      "Monitor 32\" 4K IPS",
      "Mesa digitalizadora Wacom Intuos",
      "Cadeira ergonômica premium",
      "Kit teclado e mouse Bluetooth"
    ],
    value: 350,
    quantity: 3,
  },
  {
    id: "4b893e69-f8e6-4118-aeab-46196170c277",
    name: "Setup Escritório Moderno",
    image: "https://i.ibb.co/0VzxRVKn/setup-7.png",
    description: [
      "Ambiente completo para escritórios, trazendo conforto, conectividade e elegância. Ideal para equipes pequenas que buscam produtividade."
    ],
        components: [
      "3 Notebooks i5 12ª geração",
      "3 Monitores 24\" Full HD",
      "3 Cadeiras ergonômicas com apoio de braço",
      "Mesa colaborativa ampla",
      "Docking stations com hub USB-C"
    ],
    value: 280,
    quantity: 2,
  },
  {
    id: "ab27b2cb-5d3a-431f-919d-e3f873580226",
    name: "Setup Home Office Conforto",
    image: "https://i.ibb.co/JRyKRM0T/setup-9.png",
    description: [
      "Pacote pensado para quem trabalha de casa e precisa de um espaço ergonômico e organizado para longas jornadas de trabalho remoto."
    ],
        components: [
      "Notebook i7 11ª geração",
      "Monitor 27\" QHD",
      "Cadeira ergonômica com apoio de pés",
      "Suporte ajustável para notebook",
      "Kit teclado mecânico silencioso",
      "Headset sem fio"
    ],
    value: 180,
    quantity: 5,
  },
  {
    id: "262a289f-abbc-4e6d-81a6-92e0b2ddaede",
    name: "Setup Multimídia Familiar",
    image: "https://i.ibb.co/TqB9kvYW/setup-10.png",
    description: [
      "Pacote completo para entretenimento familiar, estudos e reuniões online. Perfeito para quem busca praticidade em casa."
    ],
        components: [
      "PC i5 12ª geração",
      "Monitor 27\" Full HD",
      "Caixas de som estéreo",
      "Webcam Full HD",
      "Cadeira ergonômica intermediária",
      "Impressora multifuncional Wi-Fi"
    ],
    value: 150,
    quantity: 4,
  },
  {
    id: "90868794-e9bf-4b4f-9265-ff23d9f2b9fc",
    name: "Setup Streaming Pro",
    image: "https://i.ibb.co/G6XT2k3/setup-4.png",
    description: [
      "Pacote perfeito para criadores de conteúdo que buscam qualidade em transmissões ao vivo e gravações. Inclui PC potente, câmera, microfone e iluminação profissional."
    ],
        components: [
      "Ryzen 7 5800X",
      "RTX 3070 8GB",
      "32 GB RAM DDR4",
      "SSD NVMe 1 TB",
      "Câmera Full HD Logitech StreamCam",
      "Microfone condensador Blue Yeti",
      "Ring Light 18\""
    ],
    value: 300,
    quantity: 4,
  },
]

export const reservas: Reserva[] = []

export const feedbacks: Feedback[] = [
  {
    id: "ffa7ac13-40fc-4d03-9f73-7e731d8bfb74",
    clienteId: "e058ec90-d701-44ee-9eec-d4192639095e",
    pacoteId: "669186d6-1224-474a-8092-2ddedfb268ee",
    rating: 4,
    comentario: "O setup gamer é excelente, máquinas muito rápidas e silenciosas. Só achei que os fones poderiam ter uma qualidade um pouco melhor.",
  },
  {
    id: "cbe695b0-cc9f-43e6-a33a-a2eddac3c0a2",
    clienteId: "f0da4a6a-cbf2-4544-9032-ebf8056ccd10",
    pacoteId: "0348dba9-264f-40d1-aa63-22310eb3b62a",
    rating: 3,
    comentario: "O notebook é realmente potente e a cadeira é confortável, mas o monitor auxiliar poderia ter mais ajustes de altura. No geral, bom custo-benefício.",
  },
  {
    id: "886a0a7c-f938-4dce-a5d2-04c5bb55e507",
    clienteId: "872d7718-300c-4cd4-9d34-015f91974001",
    pacoteId: "dcd6e301-2560-48a1-9135-92bd3f0c2401",
    rating: 5,
    comentario: "Perfeito para o nosso time! Todos ficaram satisfeitos com o desempenho e a ergonomia. O espaço de trabalho colaborativo ficou incrível.",
  },
  {
    id: "bdf432fb-b741-430e-ad74-8bd0dbbea6b0",
    clienteId: "2e9b15e5-fadf-4d5e-961e-b99a3e588b42",
    pacoteId: "669186d6-1224-474a-8092-2ddedfb268ee",
    rating: 4,
    comentario: "Uso o setup profissional diariamente no home office e tem atendido muito bem. A iluminação para videoconferência foi um diferencial.",
  },
]
