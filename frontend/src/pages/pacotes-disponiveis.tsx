import { FilterIcon } from "@/components/icons/filter-icon";
import { SlidersIcon } from "@/components/icons/sliders-icon";
import { PacoteImage } from "@/components/pacote-image";
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format-currency";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/root-reducer";

export default function PacotesDisponiveisPage() {
  const { pacotes } = useSelector((state: RootState) => state.pacotesReducer)
  const pacotesDisponiveis = pacotes.filter(pacote => pacote.quantity > 0)

  return (
    <PageContainer.List>
      <PageTitle>Pacotes Disponíveis</PageTitle>

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

      <section className="flex-1 flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array(10).fill(pacotesDisponiveis).flat().map((pacote, i) => {
          const formattedValue = formatCurrency(pacote.value)

          return (
            <Link key={pacote.name} to={`/informacoes-pacote/${i % pacotesDisponiveis.length}`} className="w-80 md:w-full max-h-108 px-3.5 py-4 flex flex-col gap-3 border border-gray/50 bg-white/5 hover:bg-white/10 rounded-xl flex-shrink-0 backdrop-blur-md cursor-pointer transition-colors duration-200">
              <PacoteImage
                pacote={pacote}
                className="w-full"
              />

              <h3 className="text-2xl font-semibold text-white leading-[120%] underline decoration-dotted decoration-[4%] underline-offset-4 decoration-skip-ink-auto decoration-inherit">
                {pacote.name}
              </h3>

              <p className="font-light text-gray leading-[140%] line-clamp-4" title={pacote.description[0]}>
                {pacote.description[0]}
              </p>
              
              <p className="font-semibold text-gray mt-auto">
                Valor (hora): <span className="text-lg">{formattedValue}</span>
              </p>
            </Link>
          )
        })}
      </section>
    </PageContainer.List>
  );
}