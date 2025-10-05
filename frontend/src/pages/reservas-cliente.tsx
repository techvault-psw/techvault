import { DetalhesReservaDialog } from "@/components/dialogs/detalhes-reserva-dialog"
import { FilterIcon } from "@/components/icons/filter-icon"
import { SlidersIcon } from "@/components/icons/sliders-icon"
import { PageContainer } from "@/components/page-container"
import { PageTitle } from "@/components/page-title"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { type Reserva } from "@/redux/reservas/slice"
import useCargo from "@/hooks/useCargo"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { useEffect, useMemo } from "react"
import { useNavigate, useParams, useLocation } from "react-router"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/root-reducer"
import { Separator } from "@/components/ui/separator"
import { stringifyAddress } from "@/consts/enderecos"
import { selectAllClientes } from "@/redux/clientes/slice"

interface ReservaSectionProps {
  titulo: string
  reservas: Reserva[]
}

const ReservaSection = ({ titulo, reservas }: ReservaSectionProps) => {
  if (reservas.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex gap-2 items-center w-full">
        <span className="font-medium text-white text-xl flex-shrink-0">{titulo}</span>
        <div className="flex-1 bg-white/50 h-px" />
      </div>
      <section className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reservas.map((reserva, i) => {
          const formattedStartDate = format(new Date(reserva.dataInicio), "dd/MM/yyyy HH:mm")
          const formattedEndDate = format(new Date(reserva.dataTermino), "dd/MM/yyyy HH:mm")

          const pacote = reserva.pacote

          if (!pacote) return

          return (
            <DetalhesReservaDialog reserva={reserva}>
              <Card.Container key={i} className="bg-white/5 hover:bg-white/10 border border-slate-500/50 backdrop-blur-sm transition-colors duration-200 h-full">
                <Card.TextContainer className="text-white truncate">
                  <div className="flex items-center justify-between gap-2 font-semibold">
                    <Card.Title className="truncate">{pacote.name}</Card.Title>
                    {reserva.status === "Cancelada" && <Badge variant="dark-red">Cancelada</Badge>}
                  </div>
                  <Card.Description className="leading-[120%]">
                    <span className="font-medium">Endereço:</span> {stringifyAddress(reserva.endereco)}
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
  const { id } = useParams<{ id: string }>();
  const numberId = Number(id)
 const clientes = useSelector(selectAllClientes)

  const cliente = clientes.find((cliente) => cliente.id === numberId)

  if (isNaN(numberId) || numberId >= clientes.length || !cliente) {
    return
  }

  const {isGerente, isSuporte} = useCargo()

  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { fromClientDialog?: number; returnTo?: string; fromReservaId?: number } | null

  useEffect(() => {
    if(!isGerente() && !isSuporte()) {
      navigate("/login")
    }
  })

  const { reservas } = useSelector((rootReducer : RootState) => rootReducer.reservasReducer)

  const filteredReservas = reservas.filter((reserva) => reserva.cliente.id === numberId)

  const sortedReservas = useMemo(() => {
    return [...filteredReservas].sort((a, b) => {
        const dateA = new Date(a.dataInicio).getTime();
        const dateB = new Date(b.dataInicio).getTime();
        return dateB - dateA;
    })
  }, [filteredReservas])

  const reservasAtuais = sortedReservas.filter((r) => r.status === "Confirmada")
  const reservasConcluidas = sortedReservas.filter((r) => r.status === "Concluída")
  const reservasCanceladas = sortedReservas.filter((r) => r.status === "Cancelada")

  return (
    <PageContainer.List>
      <PageTitle>Reservas de {cliente.name}</PageTitle>

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

      {!filteredReservas.length && (
        <>
          <Separator />
          <p className='text-base text-white text-center w-full'>
            O cliente "{cliente.name}" ainda não realizou nenhuma reserva.
          </p>
        </>
      )}

      <section className="w-full flex flex-col gap-4 scrollbar">
        <ReservaSection titulo="Atuais" reservas={reservasAtuais} />
        <ReservaSection titulo="Concluídas" reservas={reservasConcluidas} />
        <ReservaSection titulo="Canceladas" reservas={reservasCanceladas} />
      </section>

      <Button
        variant="outline"
        onClick={() => {
          const returnTo = state?.returnTo || "/clientes";
          navigate(returnTo, { 
            state: { 
              fromClientDialog: numberId,
              fromReservaId: state?.fromReservaId
            } 
          });
        }}
        className="w-full max-w-100 mx-auto mt-auto flex-none"
      >
        <ArrowLeft size={16} className="mr-2" />
        Voltar
      </Button>
    </PageContainer.List>
  );
};