import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Card } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { FilterIcon } from "@/components/icons/filter-icon";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DetalhesReservaDialog } from "@/components/dialogs/detalhes-reserva-dialog";
import useCargo from "@/hooks/useCargo";
import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/root-reducer";
import type { Reserva } from "@/redux/reservas/slice";
import { stringifyAddress } from "@/consts/enderecos";
import { agruparReservasPorData } from "@/lib/agrupar-reservas";

export interface ReservaComTipo {
  reserva: Reserva;
  tipo: 'Entrega' | 'Coleta';
  hora: Date;
}

export default function ReservasPage() {
  const { isGerente, isSuporte } = useCargo();
  const navigate = useNavigate();
  const location = useLocation();
  const [reservaToOpen, setReservaToOpen] = useState<number | null>(null);
  const [clienteToOpen, setClienteToOpen] = useState<number | null>(null);

  useEffect(() => {
    if (!isGerente() && !isSuporte()) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const state = location.state as { fromClientDialog?: number; fromReservaId?: number } | null;
    if (state?.fromReservaId !== undefined) {
      setReservaToOpen(state.fromReservaId);
    }
    if (state?.fromClientDialog !== undefined) {
      setClienteToOpen(state.fromClientDialog);
    }
  }, [location]);

  const { reservas } = useSelector((rootReducer: RootState) => rootReducer.reservasReducer);
  
  const reservasConfirmadas = reservas.filter((reserva) =>  reserva.status === "Confirmada");
  const reservasPorData = agruparReservasPorData(reservasConfirmadas)
  
  const reservaParaAbrir = reservaToOpen !== null ? reservas.find(r => r.id === reservaToOpen) : null;

  return (
    <PageContainer.List> 
      <PageTitle>Reservas</PageTitle>

      <div className="w-40 md:w-52 py-1 gap-4 items-center justify-center">
        <Button className="w-40 md:w-52" variant="secondary" size="sm">
          <FilterIcon className="size-4.5" />
          Filtros
        </Button>
      </div>

      {reservasPorData.length === 0 ? (
        <p className="text-base text-white w-full text-center">
          Não há reservas confirmadas no momento.
        </p>
      ) : (
        <section className="w-full flex flex-col gap-6 scrollbar">
          {reservasPorData.map(({ date, reservas: reservasComTipo }, i) => {
            const diaFormatado = 
              isToday(date)
                ? "Hoje"
                : isTomorrow(date)
                  ? "Amanhã"
                  : format(date, "d 'de' MMMM", { locale: ptBR })

            return (
              <div className="w-full flex flex-col gap-4" key={i}>
                <div className="flex items-center gap-4 w-full">
                  <h2 className="text-xl font-semibold text-white whitespace-nowrap">
                    {diaFormatado}
                  </h2>
                  <Separator className="w-auto flex-1" />
                </div>

                <section className="flex flex-col gap-4 w-full md:grid md:grid-cols-2 xl:grid-cols-3">
                  {reservasComTipo.map(({ reserva, hora, tipo }, j) => {
                    const pacote = reserva.pacote;

                    if (!pacote) return null;

                    return (
                      <DetalhesReservaDialog 
                        key={`${reserva.id}-${tipo}-${hora.getTime()}`} 
                        reserva={reserva} 
                        tipo={tipo}
                      >
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

                            <Card.Description className="leading-[120%] truncate" title={stringifyAddress(reserva.endereco)}>
                              <span className="font-medium">Endereço: </span>
                              {stringifyAddress(reserva.endereco)}
                            </Card.Description>

                            <Card.Description className="leading-[120%]">
                              <span className="font-medium">Horário: </span>
                              {format(hora, "HH:mm")}
                            </Card.Description>
                          </Card.TextContainer>
                        </Card.Container>
                      </DetalhesReservaDialog>
                    );
                  })}
                </section>
              </div>
            )
          })}
        </section>
      )}

      {reservaParaAbrir && (
        <DetalhesReservaDialog
          reserva={reservaParaAbrir}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setReservaToOpen(null);
              setClienteToOpen(null);
            }
          }}
          openClientDialog={clienteToOpen === reservaParaAbrir.cliente.id}
        >
          <div style={{ display: 'none' }} />
        </DetalhesReservaDialog>
      )}
    </PageContainer.List>
  );
}