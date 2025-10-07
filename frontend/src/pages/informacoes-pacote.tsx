import { HighlightBox } from "@/components/highlight-box";
import { PacoteImage } from "@/components/pacote-image";
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format-currency";
import { fetchPacotes } from "@/redux/pacotes/fetch";
import { selectAllPacotes, selectPacoteById } from '@/redux/pacotes/slice';
import type { RootState } from "@/redux/root-reducer";
import type { AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

export default function InformacoesPacotePage() {
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch<AppDispatch>()
  const { status: statusP, error: errorP } = useSelector((rootReducer: RootState) => rootReducer.pacotesReducer)

  useEffect(() => {
    if (['not_loaded', 'saved', 'deleted'].includes(statusP)) {
      dispatch(fetchPacotes())
    }
  }, [statusP, dispatch])
  
  const pacotes = useSelector(selectAllPacotes);

  const numberId = Number(id)

  const pacote = useSelector((state: RootState) => selectPacoteById(state, numberId))
  const formattedValue = formatCurrency(pacote?.value ?? 0)
  
  const navigate = useNavigate()
  
  const { clienteAtual } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)
  
  const handleSolicitarReserva = () => {
    const url = `/confirmar-reserva/${numberId}`;
    
    if (clienteAtual) {
      navigate(url)
    } else {
      navigate(`/login?redirectTo=${encodeURIComponent(url)}`)
    }
  }

  if (isNaN(numberId) || numberId >= pacotes.length) {
    return
  }

  if (['loading', 'saving', 'deleting'].includes(statusP)) {
    return (
      <PageContainer.Card>
        <p className="text-lg text-white text-center py-2 w-full">Carregando...</p>
      </PageContainer.Card>
    )
  }

  if (['failed'].includes(statusP)) {
    return (
      <PageContainer.Card>
        <p className="text-lg text-white text-center py-2 w-full">{errorP}</p>
      </PageContainer.Card>
    )
  }

  return (
    <PageContainer.Card>
      <div className="flex flex-col items-center gap-3">
        <PacoteImage pacote={pacote} className="max-w-full h-55 md:h-66 xl:h-77 rounded-lg md:rounded-xl border-gray/30" />

        <PageTitle className="sm:text-4xl font-semibold">{pacote.name}</PageTitle>
      </div>

      <Separator />

      <div className="flex flex-col gap-4 md:overflow-y-auto md:pr-1 custom-scrollbar-ver">
        <div className="text-white flex flex-col gap-1">
          <span className="font-bold text-xl">Descrição</span>

          {pacote.description.map((description) => (
            <p className="text-sm lg:text-base">{description}</p>
          ))}
        </div>
        
        <div className="text-white flex flex-col gap-1">
          <span className="font-bold text-xl">Componentes do PC</span>

          <ul className="list-disc text-sm ml-5 lg:text-base">
            {pacote.components.map((component, i) => {
              return (
                <li>{component + (i == pacote.components.length - 1 ? '.' : ';')}</li>
              )
            })}
          </ul>
        </div>
      </div>

      <p className="text-xs text-white text-center md:text-base md:max-w-8/10 md:mx-auto mt-auto">
        OBS: Todos os pacotes acompanham no-break para proteção contra falhas na rede elétrica.
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        <HighlightBox className="md:w-1/2 lg:w-1/3">
          Valor (hora): {formattedValue}
        </HighlightBox>

        <Button onClick={handleSolicitarReserva} size="lg" className="md:w-2/3">
          Solicitar Reserva
        </Button>
      </div>
    </PageContainer.Card>
  );
}