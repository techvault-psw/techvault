import { FilterIcon } from "@/components/icons/filter-icon";
import { SlidersIcon } from "@/components/icons/sliders-icon";
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { formatCurrency } from "@/lib/format-currency";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { reservas } from "@/consts/reservas";
import { pacotes } from "@/consts/pacotes";
import { PacoteImage } from "@/components/pacote-image";
import { Link } from "react-router";

export default function MinhasReservasPage() {
    return (
        <PageContainer.List>
            <PageTitle>Minhas Reservas</PageTitle>

            <div className="flex items-center gap-4 flex-shrink-0">
                <Button className="w-40 md:w-52" variant="secondary" size="sm">
                    <FilterIcon className="size-4.5" />
                    Filtros
                </Button>

                <Button className="w-40 md:w-52" variant="secondary" size="sm">
                    <SlidersIcon className="size-4.5" />
                    Ordenar por
                </Button>
            </div>

        
            <div className="w-full flex flex-col items-center gap-5 scrollbar md:grid lg:grid-cols-2 2xl:grid-cols-3">
                {Array(200).fill(reservas).flat().map((reserva, index) => {
                    const formattedValue = formatCurrency(reserva.valor);

                    const formattedStartDate = format(reserva.dataInicio, "dd/MM/yyyy HH:mm", {locale: ptBR})
                    const formattedEndDate = format(reserva.dataTermino, "dd/MM/yyyy HH:mm", {locale: ptBR})

                    return (
                        <Link to={`/informacoes-reserva/${index % reservas.length}`} key={index} className="w-full max-w-120 lg:max-w-140 border border-gray/50 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl shadow-lg flex flex-col gap-4 p-4 cursor-pointer transition-colors duration-200">
                            <div className="flex gap-2">
                                <PacoteImage
                                    pacote={pacotes[reserva.pacoteIndex]}
                                    className="h-22"
                                />

                                <div className="flex-1 flex flex-col gap-2 justify-between text-white text-lg font-semibold">
                                    <h2 className="text-lg">{pacotes[reserva.pacoteIndex].name}</h2>
                                    <p className="text-right text-gray font-medium">{formattedValue}</p>
                                </div>
                            </div>

                            <Separator/>

                            <div className="grid grid-cols-[1.8fr_1.2fr] grid-rows-3 gap-1 text-white">
                                <p>Status:</p><p className="text-right">{reserva.status}</p>
                                <p>Data e Hora de Início:</p><p className="text-right">{formattedStartDate}</p>
                                <p>Data e Hora de Término:</p><p className="text-right">{formattedEndDate}</p>
                            </div>

                            <Separator className="lg:hidden"/>

                            <p className="font-semibold text-white text-md text-center lg:hidden">Clique para mais informações</p>
                        </Link>
                    )
                })}
            </div>
        </PageContainer.List>
    )
};