import { FilterIcon } from "@/components/icons/filter-icon";
import { SlidersIcon } from "@/components/icons/sliders-icon";
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { formatCurrency } from "@/lib/format-currency";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { PacoteImage } from "@/components/pacote-image";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/root-reducer";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { selectAllReservas } from "@/redux/reservas/slice";
import { fetchReservas } from "@/redux/reservas/fetch";
import type { AppDispatch } from "@/redux/store";

export default function MinhasReservasPage() {
    const navigate = useNavigate()
    const { clienteAtual } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)
    const { status: statusR, error: errorR } = useSelector((rootReducer : RootState) => rootReducer.reservasReducer)
    const reservas = useSelector(selectAllReservas)

    const location = useLocation()

    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        if (!clienteAtual) {
            navigate(`/login?redirectTo=${location.pathname}`)
        }
    }, [])

    useEffect(() => {
        if (['not_loaded', 'saved', 'deleted'].includes(statusR)) {
            dispatch(fetchReservas())
        }
    }, [statusR, dispatch])

    const reservasFiltradas = reservas
        .filter(reserva => reserva.cliente.id === clienteAtual?.id)
        .sort((a, b) => {
            const statusOrder: Record<string, number> = {
                "Confirmada": 1,
                "Concluída": 2,
                "Cancelada": 3
            };

            const statusA = statusOrder[a.status] ?? 99
            const statusB = statusOrder[b.status] ?? 99

            if (statusA !== statusB) {
                return statusA - statusB
            }

            return new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime()
        })

    return (
        <PageContainer.List>
            <PageTitle>Minhas Reservas</PageTitle>

            <div className="w-full flex flex-col items-center gap-4 md:items-start lg:items-center lg:flex-row lg:justify-between">
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
                {clienteAtual && (
                    <Link to="/pacotes-disponiveis" className="w-full max-w-120 lg:flex lg:justify-end">
                        <Card.Container className="sm:w-120 lg:w-90 bg-black hover:bg-slate-900">
                            <Card.Title>Deseja fazer uma nova reserva?</Card.Title>
                        </Card.Container>
                    </Link>
                )}
            </div>

            {['loading', 'saving', 'deleting'].includes(statusR) ? (
                <p className="text-lg text-white text-center py-2 w-full">Carregando...</p>
            ) : ['failed'].includes(statusR) ? (
                <p className="text-lg text-white text-center py-2 w-full">{errorR}</p>
            ) : reservasFiltradas.length === 0 ? (
                <p className='text-base text-white text-center w-full'>
                    Você ainda não realizou nenhuma reserva.
                </p>
            ) : (
                <div className="w-full flex flex-col items-center gap-5 scrollbar md:grid lg:grid-cols-2 2xl:grid-cols-3">
                    {reservasFiltradas.map((reserva, index) => {
                        const formattedValue = formatCurrency(reserva.valor);

                        const formattedStartDate = format(reserva.dataInicio, "dd/MM/yyyy HH:mm", {locale: ptBR})
                        const formattedEndDate = format(reserva.dataTermino, "dd/MM/yyyy HH:mm", {locale: ptBR})

                        const pacote = reserva.pacote

                        if (!pacote) return

                        return (
                            <Link to={`/informacoes-reserva/${reserva.id}`} key={index} className="w-full max-w-120 lg:max-w-140 border border-gray/50 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl shadow-lg flex flex-col gap-4 p-4 cursor-pointer transition-colors duration-200">
                                <div className="flex gap-2">
                                    <PacoteImage
                                        pacote={pacote}
                                        className="h-22"
                                    />

                                    <div className="flex-1 flex flex-col gap-2 justify-between text-white text-lg font-semibold">
                                        <h2 className="text-lg">{pacote.name}</h2>
                                        <p className="text-right text-gray font-medium">{formattedValue}</p>
                                    </div>
                                </div>

                                <Separator/>

                                <div className="grid grid-cols-[1.8fr_1.2fr] grid-rows-3 gap-1 text-white">
                                    <p>Status:</p><p className="text-right">
                                        {reserva.status === "Confirmada" ? (
                                            <Badge className="py-0" variant="green">{reserva.status}</Badge>
                                        ) : reserva.status === "Concluída" ? (
                                            <Badge className="py-0" variant="purple">{reserva.status}</Badge>
                                        ) : reserva.status === "Cancelada" && (
                                            <Badge className="py-0" variant="dark-red">{reserva.status}</Badge>
                                        )}
                                    </p>
                                    <p>Data e Hora de Início:</p><p className="text-right">{formattedStartDate}</p>
                                    <p>Data e Hora de Término:</p><p className="text-right">{formattedEndDate}</p>
                                </div>

                                <Separator className="lg:hidden"/>

                                <p className="font-semibold text-white text-md text-center lg:hidden">Clique para mais informações</p>
                            </Link>
                        )
                    })}
                </div>
            )}
        </PageContainer.List>
    )
};