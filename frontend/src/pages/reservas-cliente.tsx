import { DetalhesReservaDialog } from "@/components/dialogs/detalhes-reserva-dialog"
import { FilterIcon } from "@/components/icons/filter-icon"
import { SlidersIcon } from "@/components/icons/sliders-icon"
import { PageContainer } from "@/components/page-container"
import { PageTitle } from "@/components/page-title"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { reservas, type Reserva } from "@/consts/reservas"
import useCargo from "@/hooks/useCargo"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/root-reducer"

interface ReservaSectionProps {
  titulo: string
  reservas: Reserva[]
}

const ReservaSection = ({ titulo, reservas }: ReservaSectionProps) => {
  if (reservas.length === 0) return null;

  const qtdReservas = Math.floor(Math.random() * (8 - 5 + 1)) + 5;
  const { pacotes } = useSelector((state: RootState) => state.pacotesReducer)
  
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex gap-2 items-center w-full">
        <span className="font-medium text-white text-xl flex-shrink-0">{titulo}</span>
        <div className="flex-1 bg-white/50 h-px" />
      </div>
      <section className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array(qtdReservas).fill(reservas).flat().map((reserva, i) => {
          const formattedStartDate = format(reserva.dataInicio, "dd/MM/yyyy hh:MM")
          const formattedEndDate = format(reserva.dataTermino, "dd/MM/yyyy hh:MM")

          return (
            <DetalhesReservaDialog reserva={reserva}>
              <Card.Container key={i} className="bg-white/5 hover:bg-white/10 border border-slate-500/50 backdrop-blur-sm transition-colors duration-200 h-full">
                <Card.TextContainer className="text-white truncate">
                  <div className="flex items-center justify-between gap-2 font-semibold">
                    <Card.Title className="truncate">{pacotes[reserva.pacoteIndex].name}</Card.Title>
                    {reserva.status === "Cancelada" && <Badge variant="dark-red">Cancelada</Badge>}
                  </div>
                  <Card.Description className="leading-[120%]">
                    <span className="font-medium">Endereço:</span> {reserva.endereco}
                  </Card.Description>
                  <Card.Description className="leading-[120%]">
                    <span className="font-medium">Data:</span> {formattedStartDate} - {formattedEndDate}
                  </Card.Description>
                </Card.TextContainer>
              </Card.Container>
            </DetalhesReservaDialog>
          )
        })}
      </section>
    </div>
  );
};

export default function ReservasClientePage() {
  const {isGerente, isSuporte} = useCargo()

  const navigate = useNavigate()

  useEffect(() => {
    if(!isGerente() && !isSuporte()) {
      navigate("/login")
    }
  })

  const sortedReservas = useMemo(() => {
    return [...reservas].sort((a, b) => {
        const dateA = a.dataInicio.getTime();
        const dateB = b.dataInicio.getTime();
        return dateB - dateA;
    })
  }, [reservas])

  const reservasAtuais = sortedReservas.filter((r) => r.status === "Confirmada")
  const reservasConcluidas = sortedReservas.filter((r) => r.status === "Concluída")
  const reservasCanceladas = sortedReservas.filter((r) => r.status === "Cancelada")

  return (
    <PageContainer.List>
      <PageTitle>Reservas de João Silva</PageTitle>

      <div className="flex items-center gap-4">
        <Button variant="secondary" className="w-40 md:w-52" size="sm">
          <FilterIcon className="size-4.5" />
          Filtros
        </Button>

        <Button variant="secondary" className="w-40 md:w-52" size="sm">
          <SlidersIcon className="size-4.5" />
          Ordenar por
        </Button>
      </div>

      <section className="w-full flex flex-col gap-4 scrollbar">
        <ReservaSection titulo="Atuais" reservas={reservasAtuais} />
        <ReservaSection titulo="Concluídas" reservas={reservasConcluidas} />
        <ReservaSection titulo="Canceladas" reservas={reservasCanceladas} />
      </section>

      <Button
        variant="outline"
        onClick={() => history.back()}
        className="w-full max-w-100 mx-auto mt-auto flex-none"
      >
        <ArrowLeft size={16} className="mr-2" />
        Voltar
      </Button>
    </PageContainer.List>
  );
};