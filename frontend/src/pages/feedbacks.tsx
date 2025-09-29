import { FilterIcon } from "@/components/icons/filter-icon";
import { SlidersIcon } from "@/components/icons/sliders-icon";
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { pacotes } from "@/consts/pacotes";

import { DarFeedbackDialog } from "@/components/dialogs/dar-feedback-dialog";
import { EditarFeedbackDialog } from "@/components/dialogs/editar-feedback-dialog";
import { ExcluirFeedbackDialog } from "@/components/dialogs/excluir-feedback-dialog";
import { TrashIcon } from "@/components/icons/trash-icon";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useCargo from "@/hooks/useCargo";
import { Pen } from "lucide-react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/root-reducer";

export default function FeedbacksPage() {
    const { isGerente } = useCargo()

    const { feedbacks } = useSelector((rootReducer: RootState) => rootReducer.feedbacksReducer)
    const { clienteAtual } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)

    return (
        <PageContainer.List>
            <PageTitle>Feedbacks</PageTitle>

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
                    <DarFeedbackDialog>
                        <Card.Container className="w-full max-w-120 lg:w-88 bg-black hover:bg-slate-900">
                            <Card.Title>Dar Feedback</Card.Title>
                        </Card.Container>
                    </DarFeedbackDialog>
                )}
            </div>

            <Separator />
        
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
        </PageContainer.List>)
}


