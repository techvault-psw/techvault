import { FilterIcon } from "@/components/icons/filter-icon";
import { SlidersIcon } from "@/components/icons/sliders-icon";
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { feedbacks } from "@/consts/feedbacks";
import { pacotes } from "@/consts/pacotes";

import { Card } from "@/components/ui/card";
import { Link } from "react-router";
import { Pen, X } from "lucide-react";
import { TrashIcon } from "@/components/icons/trash-icon";
import { Separator } from "@/components/ui/separator";

export default function FeedbacksPage() {
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

                <Card.Container className="w-full max-w-120 lg:w-88 bg-black hover:bg-slate-900">
                    <Card.Title>Dar Feedback</Card.Title>
                </Card.Container>
            </div>

            <Separator />
        
            <section className="w-full flex flex-col items-center gap-4 scrollbar md:grid lg:grid-cols-2 xl:grid-cols-3">
                {Array(10).fill(feedbacks).flat().map((feedback, index) => {
                    return (
                        <div key={index} className="w-full h-full p-3 flex flex-col gap-3 bg-white/5 border border-gray/40 rounded-lg backdrop-blur-sm">
                            <div className="flex items-start justify-between gap-2 overflow-x-hidden">
                                <div className="flex-1 flex flex-col gap-3">
                                    <span className="text-lg text-white font-semibold leading-none">{feedback.cliente}</span>

                                    <StarRating rating={feedback.nota}/>

                                    <span className="leading-[130%] text-gray font-light text-justify flex-1 line-clamp-4">
                                        {feedback.descricao}
                                    </span>
                                </div>

                                <div className="flex-col gap-3 hidden md:flex">
                                    <Button variant="outline" size="icon" className="rounded-full size-8 p-1.5">
                                        <Pen className="size-full" />
                                    </Button>

                                    <Button variant="destructive" size="icon" className="rounded-full size-8 p-1.5">
                                        <TrashIcon className="size-full" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 md:hidden">
                                <Button variant="destructive" size="sm" className="gap-2">
                                    <TrashIcon className="size-4" />
                                    Excluir
                                </Button>

                                <Button variant="outline" size="sm" className="gap-2">
                                    <Pen className="size-4" />
                                    Editar
                                </Button>
                            </div>

                            <Card.Container>
                                <Link to={`/informacoes-pacote/${feedback.pacoteIndex}`}>
                                    <Card.Title>
                                        {pacotes[feedback.pacoteIndex].name}
                                    </Card.Title>
                                </Link>
                            </Card.Container>
                        </div>
                    )
                })}
            </section>
        </PageContainer.List>)
}


