import { FilterIcon } from "@/components/icons/filter-icon";
import { SlidersIcon } from "@/components/icons/sliders-icon";
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/ui/star-rating";
import { feedbacks } from "@/consts/feedbacks";
import { pacotes } from "@/consts/pacotes";
import { ArrowRightIcon } from '@/components/icons/arrow-right-icon';

import { Link } from "react-router";

export default function FeedbackPage() {
    return (
        <PageContainer.List>
            <PageTitle>Feedbacks</PageTitle>

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

        
            <section className="w-full flex flex-col items-center gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] md:grid lg:grid-cols-2 xl:grid-cols-3">
                {Array(10).fill(feedbacks).flat().map((feedback, index) => {
                    return (
                        <div key={index} className="w-full p-3 flex flex-col gap-3 bg-white/5 border border-gray-2/50 rounded-lg backdrop-blur-sm">
                            <div className="flex gap-2">
                                

                                <div className="flex-1 flex flex-col gap-2 justify-between text-white text-lg font-semibold">
                                    <h2 className="text-lg">{feedback.cliente}</h2>
                                    <div className="flex gap-2 items-center">
                                        <StarRating.Stars rating={feedback.nota}/>
                                    </div>

                                </div>
                            </div>

                            <span className="leading-[130%] text-gray-2 font-light text-justify">
                                {feedback.descricao}
                            </span>
                            

                            <Separator className="lg:hidden"/>

                            <Link to={`/informacoes-pacote/${feedback.pacoteIndex}`}
                                  className="w-full px-3 py-2 flex items-center justify-between hover:bg-white/5 border border-gray-2/50 rounded-lg backdrop-blur-sm cursor-pointer transition-colors duration-200"
                            >
                                <div className="flex flex-col gap-2 text-white">
                                    <h4 className="font-medium text-lg leading-none">
                                        {pacotes[feedback.pacoteIndex].name}
                                    </h4>
                                </div>
                                
                                <ArrowRightIcon />
                            </Link>
                        
                        </div>
                    )
                })}
            </section>
        </PageContainer.List>)
}


