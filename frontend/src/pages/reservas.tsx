import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Card } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { FilterIcon } from "@/components/icons/filter-icon";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const entrega = [
  {
    nome: "Setup Gamer Duplo",
    Horario: "21:30",
    Endereco: "Avenida Paulista, 1578 - Bela Vista",
    tipo: "Entrega"
  },
    {
    nome: "Setup Gamer Duplo",
    Horario: "21:30",
    Endereco: "Avenida Paulista, 1578 - Bela Vista",
    tipo: "Entrega"
  },
    {
    nome: "Setup Gamer Duplo",
    Horario: "21:30",
    Endereco: "Avenida Paulista, 1578 - Bela Vista",
    tipo: "Entrega"
  },
    {
    nome: "Setup Profissional de Trabalho",
    Horario: "21:30",
    Endereco: "Avenida Paulista, 1578 - Bela Vista",
    tipo: "Coleta"
  },
];

export default function ReservasPage() {
  return (
    <PageContainer.List> 
      <PageTitle>Reservas</PageTitle>

      <div className="w-40 md:w-52 py-1 gap-4 items-center justify-center">
                <Button className="w-40 md:w-52" variant="secondary" size="sm">
                    <FilterIcon className="size-4.5" />
                    Filtros
                </Button>
        </div>

        <section className="w-full flex flex-col gap-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
            <div className="flex items-center gap-4 w-full">
                <h2 className="text-xl font-semibold text-white whitespace-nowrap">Hoje</h2>
                <Separator />
            </div>

        <section className="flex flex-col gap-4 w-full md:grid md:grid-cols-2 xl:grid-cols-3">
            {entrega.map((entrega, i) => (
            <Card.Container key={i}>
                <Card.TextContainer className="w-full">
                <div className="flex items-center justify-between">
                    <Card.Title className="truncate font-semibold">{entrega.nome}</Card.Title>

                    <Badge variant={entrega.tipo === "Entrega" ? "green" : "purple"}>
                    {entrega.tipo}
                    </Badge>
                </div>

                <div className="flex flex-col text-base text-gray-2 font-light truncate ">
                    <p className="truncate">
                        <span className="font-medium">Endereço: </span>
                        {entrega.Endereco}
                    </p>
                    <p className="truncate">
                        <span className="font-medium">Horário: </span>
                        {entrega.Horario}
                    </p>
                </div>
                </Card.TextContainer>
            </Card.Container>
            ))}
        </section> 

        <div className="flex items-center gap-4 w-full">
                <h2 className="text-xl font-semibold text-white whitespace-nowrap">Amanhã</h2>
                <Separator/>
            </div>

        <section className="flex flex-col gap-4 w-full md:grid md:grid-cols-2 xl:grid-cols-3">
            {entrega.map((entrega, i) => (
            <Card.Container key={i}>
                <Card.TextContainer className="w-full">
                <div className="flex items-center justify-between">
                    <Card.Title className="truncate font-semibold">{entrega.nome}</Card.Title>

                    <Badge variant={entrega.tipo === "Entrega" ? "green" : "purple"} className="text-sm py-1 px-3 font-medium">
                    {entrega.tipo}
                    </Badge>
                </div>

                <div className="flex flex-col text-base text-gray-2 font-light truncate ">
                    <p className="truncate">
                        <span className="font-medium">Endereço: </span>
                        {entrega.Endereco}
                    </p>
                    <p className="truncate">
                        <span className="font-medium">Horário: </span>
                        {entrega.Horario}
                    </p>
                </div>
                </Card.TextContainer>
            </Card.Container>
            ))}
        </section> 

        <div className="flex items-center gap-4 w-full">
                <h2 className="text-xl font-semibold text-white whitespace-nowrap">13 de Setembro</h2>
                <Separator/>
            </div>

        <section className="flex flex-col gap-4 w-full md:grid md:grid-cols-2 xl:grid-cols-3">
            {entrega.map((entrega, i) => (
            <Card.Container key={i}>
                <Card.TextContainer className="w-full">
                <div className="flex items-center justify-between">
                    <Card.Title className="truncate font-semibold">{entrega.nome}</Card.Title>

                    <Badge variant={entrega.tipo === "Entrega" ? "green" : "purple"} className="text-sm py-1 px-3 font-medium">
                    {entrega.tipo}
                    </Badge>
                </div>

                <div className="flex flex-col text-base text-gray-2 font-light truncate ">
                    <p className="truncate">
                        <span className="font-medium">Endereço: </span>
                        {entrega.Endereco}
                    </p>
                    <p className="truncate">
                        <span className="font-medium">Horário: </span>
                        {entrega.Horario}
                    </p>
                </div>
                </Card.TextContainer>
            </Card.Container>
            ))}
        </section> 
    </section>
    </PageContainer.List>
  );
}