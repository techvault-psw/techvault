import { GoBackButton } from "@/components/go-back-button";
import { FilterIcon } from "@/components/icons/filter-icon";
import { SlidersIcon } from "@/components/icons/sliders-icon";
import { FiltrosPacotesDialog } from "@/components/dialogs/filtros-pacotes-dialog";
import { OrdenarPacotesDialog } from "@/components/dialogs/ordenar-pacotes-dialog";
import { PacoteImage } from "@/components/pacote-image";
import { PageContainer } from "@/components/page-container";
import { PageTitle, PageTitleContainer } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format-currency";
import { fetchPacotes } from "@/redux/pacotes/fetch";
import { selectAllPacotes } from "@/redux/pacotes/slice";
import type { RootState } from "@/redux/root-reducer";
import type { AppDispatch } from "@/redux/store";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function PacotesDisponiveisPage() {
  const pacotes = useSelector(selectAllPacotes);
  const [filtros, setFiltros] = useState<any>({});
  const [ordenacao, setOrdenacao] = useState<any>({ campo: "name", ordem: "asc" });
  
  const dispatch = useDispatch<AppDispatch>()
  const { status: statusP, error: errorP } = useSelector((rootReducer: RootState) => rootReducer.pacotesReducer)

  useEffect(() => {
    if (['not_loaded', 'saved', 'deleted'].includes(statusP)) {
      dispatch(fetchPacotes())
    }
  }, [statusP, dispatch])

  const pacotesDisponiveis = useMemo(() => {
    let resultado = pacotes.filter(pacote => pacote.quantity > 0);

    if (filtros.valorMin) {
      resultado = resultado.filter(p => p.value >= Number(filtros.valorMin));
    }

    if (filtros.valorMax) {
      resultado = resultado.filter(p => p.value <= Number(filtros.valorMax));
    }

    if (filtros.quantidadeMin) {
      resultado = resultado.filter(p => p.quantity >= Number(filtros.quantidadeMin));
    }

    if (filtros.quantidadeMax) {
      resultado = resultado.filter(p => p.quantity <= Number(filtros.quantidadeMax));
    }

    resultado.sort((a, b) => {
      let valorA: any, valorB: any;

      switch (ordenacao.campo) {
        case "name":
          valorA = a.name.toLowerCase();
          valorB = b.name.toLowerCase();
          break;
        case "value":
          valorA = a.value;
          valorB = b.value;
          break;
        case "quantity":
          valorA = a.quantity;
          valorB = b.quantity;
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
  }, [pacotes, filtros, ordenacao])

  return (
    <PageContainer.List>
       <PageTitleContainer>
        <GoBackButton />
        <PageTitle>Pacotes Disponíveis</PageTitle>
       </PageTitleContainer>
      

      <div className="flex items-center gap-4 flex-shrink-0">
        <FiltrosPacotesDialog onApplyFilters={setFiltros}>
          <Button className="w-40 md:w-52" variant="secondary" size="sm">
            <FilterIcon className="size-4.5" />
            Filtros
          </Button>
        </FiltrosPacotesDialog>

        <OrdenarPacotesDialog onApplySort={setOrdenacao}>
          <Button className="w-40 md:w-52" variant="secondary" size="sm">
            <SlidersIcon className="size-4.5" />
            Ordenar por
          </Button>
        </OrdenarPacotesDialog>
      </div>

      {['loading', 'saving', 'deleting'].includes(statusP) ? (
        <p className="text-lg text-white text-center py-2 w-full">Carregando...</p>
      ) : ['failed'].includes(statusP) ? (
        <p className="text-lg text-white text-center py-2 w-full">{errorP}</p>
      ) : pacotesDisponiveis.length === 0 && (filtros.valorMin || filtros.valorMax) ? (
        <p className="text-base text-white text-center py-2 w-full">
          Nenhum pacote encontrado com os filtros aplicados.
        </p>
      ) : pacotesDisponiveis.length === 0 ? (
        <p className="text-base text-white text-center py-2 w-full">
          Nenhum pacote disponível no momento.
        </p>
      ) : (
        <section className="flex-1 flex flex-col gap-4 scrollbar pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pacotesDisponiveis.map((pacote, i) => {
            const formattedValue = formatCurrency(pacote.value)

            return (
              <Link key={pacote.name} to={`/informacoes-pacote/${pacote.id}`} className="w-80 md:w-full max-h-108 px-3.5 py-4 flex flex-col gap-3 border border-gray/50 bg-white/5 hover:bg-white/10 rounded-xl flex-shrink-0 backdrop-blur-md cursor-pointer transition-colors duration-200">
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
      )}
    </PageContainer.List>
  );
}