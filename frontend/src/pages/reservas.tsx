import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Card } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { FilterIcon } from "@/components/icons/filter-icon";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { pacotes } from "@/consts/pacotes";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DetalhesReservaDialog } from "@/components/dialogs/detalhes-reserva-dialog";
import useCargo from "@/hooks/useCargo";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/root-reducer";
import type { Reserva } from "@/redux/reservas/slice";

const hoje = new Date()

function criarData(diaOffset: number, hora: number, minuto: number) {
  const d = new Date(hoje)
  d.setDate(hoje.getDate() + diaOffset)
  d.setHours(hora, minuto, 0, 0)
  return d
}

function formatarDia(date: Date): string {
  if (isToday(date)) {
    return "Hoje";
  }
  if (isTomorrow(date)) {
    return "Amanhã";
  }
  if (isYesterday(date)) {
    return "Ontem";
  }
  return format(date, "d 'de' MMMM", { locale: ptBR });
}

function formatarHora(date: Date): string {
  return format(date, "HH:mm");
}

const reservasPorData: {
  date: Date
  reservas: {
    reserva: Reserva
    tipo: 'Entrega' | 'Coleta'
    hora: Date
  }[]
}[] = []

function criarReservasPorData(reservas: Reserva[]) {
  const buscarReserva = (id: number) => reservas.find(r => r.id === id);

  const reservasPorData = [
    {
      date: criarData(0, 0, 0), // hoje (00:00 só como marcador do dia)
      reservas: [
        { reserva: buscarReserva(0), tipo: 'Entrega' as const, hora: criarData(0, 9, 30) },
        { reserva: buscarReserva(1), tipo: 'Coleta' as const, hora: criarData(0, 14, 0) },
        { reserva: buscarReserva(2), tipo: 'Coleta' as const, hora: criarData(0, 16, 15) },
        { reserva: buscarReserva(1), tipo: 'Coleta' as const, hora: criarData(0, 19, 0) },
      ],
    },
    {
      date: criarData(1, 0, 0), // amanhã
      reservas: [
        { reserva: buscarReserva(0), tipo: 'Entrega' as const, hora: criarData(1, 10, 0) },
        { reserva: buscarReserva(1), tipo: 'Entrega' as const, hora: criarData(1, 13, 30) },
        { reserva: buscarReserva(1), tipo: 'Coleta' as const, hora: criarData(1, 14, 40) },
        { reserva: buscarReserva(2), tipo: 'Entrega' as const, hora: criarData(1, 18, 30) },
        { reserva: buscarReserva(0), tipo: 'Coleta' as const, hora: criarData(1, 21, 30) },
      ],
    },
    {
      date: criarData(2, 0, 0), // depois de amanhã
      reservas: [
        { reserva: buscarReserva(0), tipo: 'Coleta' as const, hora: criarData(2, 8, 45) },
        { reserva: buscarReserva(1), tipo: 'Entrega' as const, hora: criarData(2, 11, 15) },
        { reserva: buscarReserva(2), tipo: 'Coleta' as const, hora: criarData(2, 17, 0) },
        { reserva: buscarReserva(0), tipo: 'Entrega' as const, hora: criarData(2, 18, 15) },
        { reserva: buscarReserva(2), tipo: 'Coleta' as const, hora: criarData(2, 20, 30) },
      ],
    },
  ];

  return reservasPorData.map(dia => ({
    ...dia,
    reservas: dia.reservas.filter(item => item.reserva !== undefined)
  }));
}

export default function ReservasPage() {
  const {isGerente, isSuporte} = useCargo()
  const navigate = useNavigate()

  useEffect(() => {
    if(!isGerente() && !isSuporte()) {
      navigate("/login")
    }
  }, [])

  const { reservas } = useSelector((rootReducer : RootState) => rootReducer.reservasReducer)
  
  const reservasPorDataAtual = criarReservasPorData(reservas)

  return (
  <PageContainer.List> 
    <PageTitle>Reservas</PageTitle>

    <div className="w-40 md:w-52 py-1 gap-4 items-center justify-center">
      <Button className="w-40 md:w-52" variant="secondary" size="sm">
        <FilterIcon className="size-4.5" />
        Filtros
      </Button>
    </div>

    <section className="w-full flex flex-col gap-3 scrollbar">
      {reservasPorDataAtual.map(({ date, reservas: reservasComTipo }, i) => (
        <div className="w-full flex flex-col gap-3" key={i}>
          <div className="flex items-center gap-4 w-full">
            <h2 className="text-xl font-semibold text-white whitespace-nowrap">
              {formatarDia(date)}
            </h2>
            <Separator className="w-auto flex-1" />
          </div>

          <section className="flex flex-col gap-4 w-full md:grid md:grid-cols-2 xl:grid-cols-3">
            {reservasComTipo.map(({ reserva, hora, tipo }, j) => {
              if (!reserva) {
                return null;
              }

              const pacote = pacotes[reserva.pacoteIndex]

              return (
                <DetalhesReservaDialog key={`${reserva.id}-${tipo}-${j}`} reserva={reserva} tipo={tipo}>
                  <Card.Container>
                    <Card.TextContainer className="flex-1 truncate">
                      <div className="flex items-center justify-between gap-2 flex-1">
                        <Card.Title className="truncate" title={pacote.name}>
                          {pacote.name}
                        </Card.Title>

                        <Badge variant={tipo === "Entrega" ? "blue" : "purple"}>
                          {tipo}
                        </Badge>
                      </div>

                      <Card.Description className="leading-[120%] truncate" title={reserva.endereco}>
                        <span className="font-medium">Endereço: </span>
                        {reserva.endereco}
                      </Card.Description>

                      <Card.Description className="leading-[120%]">
                        <span className="font-medium">Horário: </span>
                        {formatarHora(hora)}
                      </Card.Description>
                    </Card.TextContainer>
                  </Card.Container>
                </DetalhesReservaDialog>
              )
            })}
          </section>
        </div>
      ))}
    </section>
  </PageContainer.List>
  );
}