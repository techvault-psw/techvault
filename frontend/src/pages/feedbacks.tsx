/**
 * @fileoverview Página de feedbacks sobre pacotes
 * 
 * Esta página exibe feedbacks/avaliações deixadas por clientes sobre os pacotes.
 * Permite que clientes visualizem feedbacks de outros usuários, deixem novos feedbacks
 * e gerenciem seus próprios (editar/excluir). Gerentes podem editar/excluir qualquer feedback.
 * Inclui funcionalidades de filtragem por avaliação e ordenação por critérios variados.
 * 
 * @module pages/FeedbacksPage
 */

import { FilterIcon } from "@/components/icons/filter-icon";
import { SlidersIcon } from "@/components/icons/sliders-icon";
import { FiltrosFeedbacksDialog } from "@/components/dialogs/filtros-feedbacks-dialog";
import { OrdenarFeedbacksDialog } from "@/components/dialogs/ordenar-feedbacks-dialog";
import { PageContainer } from "@/components/page-container";
import { PageTitle, PageTitleContainer } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";

import { DarFeedbackDialog } from "@/components/dialogs/dar-feedback-dialog";
import { EditarFeedbackDialog } from "@/components/dialogs/editar-feedback-dialog";
import { ExcluirFeedbackDialog } from "@/components/dialogs/excluir-feedback-dialog";
import { TrashIcon } from "@/components/icons/trash-icon";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useCargo from "@/hooks/useCargo";
import { fetchFeedbacks } from "@/redux/feedbacks/fetch";
import { selectAllFeedbacks } from "@/redux/feedbacks/slice";
import { fetchPacotes } from "@/redux/pacotes/fetch";
import type { RootState } from "@/redux/root-reducer";
import { type AppDispatch } from "@/redux/store";
import { Pen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { fetchReservas } from "@/redux/reservas/fetch";
import { GoBackButton } from "@/components/go-back-button";

/**
 * Componente da página de feedbacks
 * 
 * Exibe uma lista de feedbacks em cards responsivos (grid em dispositivos maiores).
 * Cada card mostra:
 * - Nome do cliente
 * - Classificação por estrelas
 * - Comentário do feedback (limitado a 4 linhas)
 * - Botões editar/excluir (se for dono ou gerente)
 * - Link para página de informações do pacote
 * 
 * Recursos:
 * - Filtragem por range de avaliação (1-5 estrelas)
 * - Ordenação por: avaliação, nome do cliente ou nome do pacote
 * - Botão flutuante para deixar novo feedback
 * - Acesso condicional a editar/excluir baseado no tipo de usuário
 * 
 * @component
 * @returns {JSX.Element} Página com lista de feedbacks
 * 
 * @example
 * // Uso no roteamento
 * <Route path="/feedbacks" element={<FeedbacksPage />} />
 */
export default function FeedbacksPage() {
    const { isGerente } = useCargo()

    const dispatch = useDispatch<AppDispatch>()
    const { status: statusF, error: errorF } = useSelector((rootReducer: RootState) => rootReducer.feedbacksReducer)
    const [filtros, setFiltros] = useState<any>({});
    const [ordenacao, setOrdenacao] = useState<any>({ campo: "rating", ordem: "desc" });

    useEffect(() => {
        if (['not_loaded', 'saved', 'deleted'].includes(statusF)) {
            dispatch(fetchFeedbacks())
        }
    }, [statusF, dispatch])

    const { status: statusP } = useSelector((rootReducer: RootState) => rootReducer.pacotesReducer)
    
    useEffect(() => {
      if (['not_loaded', 'saved', 'deleted'].includes(statusF)) {
          dispatch(fetchPacotes())
      }
    }, [statusP, dispatch])

    const { status: statusR } = useSelector((rootReducer: RootState) => rootReducer.reservasReducer)
    
    useEffect(() => {
      if (['not_loaded', 'saved', 'deleted'].includes(statusR)) {
          dispatch(fetchReservas())
      }
    }, [statusR, dispatch])

    const allFeedbacks = useSelector(selectAllFeedbacks)
    const { clienteAtual } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)

    const feedbacks = useMemo(() => {
        let resultado = [...allFeedbacks];

        if (filtros.ratingMin) {
            resultado = resultado.filter(f => f.rating >= Number(filtros.ratingMin));
        }

        if (filtros.ratingMax) {
            resultado = resultado.filter(f => f.rating <= Number(filtros.ratingMax));
        }

        resultado.sort((a, b) => {
            let valorA: any, valorB: any;

            switch (ordenacao.campo) {
                case "rating":
                    valorA = a.rating;
                    valorB = b.rating;
                    break;
                case "cliente":
                    valorA = a.cliente.name.toLowerCase();
                    valorB = b.cliente.name.toLowerCase();
                    break;
                case "pacote":
                    valorA = a.pacote.name.toLowerCase();
                    valorB = b.pacote.name.toLowerCase();
                    break;
                default:
                    return 0;
            }

            if (ordenacao.ordem === "asc") {
                return valorA > valorB ? 1 : -1;
            } else {
                return valorA < valorB ? 1 : -1;
            }
        });

        return resultado;
    }, [allFeedbacks, filtros, ordenacao])

    return (
        <PageContainer.List>
            <PageTitleContainer>
                <GoBackButton />
                <PageTitle> Feedbacks </PageTitle>
            </PageTitleContainer>

            <div className="w-full flex flex-col items-center gap-4 md:items-start lg:items-center lg:flex-row lg:justify-between">
                <div className="flex items-center gap-4 flex-shrink-0">
                    <FiltrosFeedbacksDialog onApplyFilters={setFiltros}>
                        <Button className="w-40 md:w-52" variant="secondary" size="sm">
                            <FilterIcon className="size-4.5" />
                            Filtros
                        </Button>
                    </FiltrosFeedbacksDialog>

                    <OrdenarFeedbacksDialog onApplySort={setOrdenacao}>
                        <Button className="w-40 md:w-52" variant="secondary" size="sm">
                            <SlidersIcon className="size-4.5" />
                            Ordenar por
                        </Button>
                    </OrdenarFeedbacksDialog>
                </div>
                <DarFeedbackDialog>
                    <Card.Container className="w-full max-w-120 lg:w-88 bg-black hover:bg-slate-900">
                        <Card.Title>Dar Feedback</Card.Title>
                    </Card.Container>
                </DarFeedbackDialog>
            </div>

            <Separator />
        
            {['loading', 'saving', 'deleting'].includes(statusF) ? (
                <p className="text-lg text-white text-center py-2 w-full">Carregando...</p>
            ) : ['failed'].includes(statusF) ? (
                <p className="text-lg text-white text-center py-2 w-full">{errorF}</p>
            ) : feedbacks.length === 0 && (filtros.ratingMin || filtros.ratingMax) ? (
                <p className="text-base text-white text-center py-2 w-full">
                    Nenhum feedback encontrado com os filtros aplicados.
                </p>
            ) : feedbacks.length === 0 ? (
                <p className="text-base text-white text-center py-2 w-full">
                    Nenhum feedback cadastrado ainda.
                </p>
            ) : (
                <section className="w-full flex flex-col items-center gap-4 scrollbar md:grid lg:grid-cols-2 xl:grid-cols-3">
                    {feedbacks.map((feedback, index) => {
                        const isMyFeedback = feedback.cliente.id === clienteAtual?.id

                        return (
                            <div key={index} className="w-full h-full p-3 flex flex-col gap-3 bg-white/5 border border-gray/40 rounded-lg backdrop-blur-sm">
                                <div className="flex-1 flex items-start justify-between gap-2 overflow-x-hidden">
                                    <div className="flex-1 flex flex-col gap-3">
                                        <span className="text-lg text-white font-semibold leading-none">{feedback.cliente.name}</span>

                                        <StarRating rating={feedback.rating} readonly/>

                                        <span className="leading-[130%] text-gray font-light text-justify flex-1 line-clamp-4 [overflow-wrap:anywhere]">
                                            {feedback.comentario}
                                        </span>
                                    </div>

                                    {(isGerente() || isMyFeedback) && (
                                        <div className="flex-col gap-3 hidden md:flex">
                                            <EditarFeedbackDialog feedback={feedback}>
                                                <Button variant="outline" size="icon" className="rounded-full size-8 p-1.5">
                                                    <Pen className="size-full" />
                                                </Button>
                                            </EditarFeedbackDialog>

                                            <ExcluirFeedbackDialog feedback={feedback}>
                                                <Button variant="destructive" size="icon" className="rounded-full size-8 p-1.5">
                                                    <TrashIcon className="size-full" />
                                                </Button>
                                            </ExcluirFeedbackDialog>
                                        </div>
                                    )}
                                </div>

                                {(isGerente() || isMyFeedback) && (
                                    <div className="flex items-center gap-3 md:hidden">
                                        <ExcluirFeedbackDialog feedback={feedback}>
                                            <Button variant="destructive" size="sm" className="gap-2">
                                                <TrashIcon className="size-4" />
                                                Excluir
                                            </Button>
                                        </ExcluirFeedbackDialog>

                                        <EditarFeedbackDialog feedback={feedback}>
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <Pen className="size-4" />
                                                Editar
                                            </Button>
                                        </EditarFeedbackDialog>
                                    </div>
                                )}

                                <Link to={`/informacoes-pacote/${feedback.pacote.id}`}>
                                    <Card.Container>
                                        <Card.Title>
                                            {feedback.pacote.name}
                                        </Card.Title>
                                    </Card.Container>
                                </Link>
                            </div>
                        )
                    })}
                </section>
            )}
        </PageContainer.List>)
}


