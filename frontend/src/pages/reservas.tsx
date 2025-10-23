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
import { OperacaoConfirmadaDialog } from "@/components/dialogs/operacao-confirmada-dialog";
import useCargo from "@/hooks/useCargo";
import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/root-reducer";
import { selectAllReservas, selectReservaById, type Reserva } from "@/redux/reservas/slice";
import { stringifyAddress } from "@/lib/stringify-address";
import { agruparReservasPorData } from "@/lib/agrupar-reservas";
import { type AppDispatch } from "@/redux/store";
import { fetchReservas } from "@/redux/reservas/fetch";

export interface ReservaComTipo {
  reserva: Reserva;
  tipo: 'Entrega' | 'Coleta';
  hora: Date;
}

export default function ReservasPage() {
  const { isGerente, isSuporte } = useCargo();
  const dispatch = useDispatch<AppDispatch>();
  const { status: statusR, error: errorR } = useSelector((rootReducer: RootState) => rootReducer.reservasReducer)

  useEffect(() => {
    if (['not_loaded', 'deleted'].includes(statusR)) {
      dispatch(fetchReservas())
    }
  }, [statusR, dispatch])
  
  const reservas = useSelector(selectAllReservas)
  const navigate = useNavigate();
  const location = useLocation();
  const [reservaToOpen, setReservaToOpen] = useState<number | null>(null);
  const [clienteToOpen, setClienteToOpen] = useState<number | null>(null);
  const [operacaoSucesso, setOperacaoSucesso] = useState<{ reserva: Reserva; tipo: "Entrega" | "Coleta" } | null>(null);

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
  
  const reservasConfirmadas = reservas.filter((reserva) =>  reserva.status === "Confirmada");
  const reservasPorData = agruparReservasPorData(reservasConfirmadas)
  
  const reservaParaAbrir = useSelector((state: RootState) => selectReservaById(state, reservaToOpen ?? -1)) ?? null

  return (
    <PageContainer.List> 
      <PageTitle>Reservas</PageTitle>

      <div className="w-40 md:w-52 py-1 gap-4 items-center justify-center">
        <Button className="w-40 md:w-52" variant="secondary" size="sm">
          <FilterIcon className="size-4.5" />
          Filtros
        </Button>
      </div>

      {['loading', 'saving', 'deleting'].includes(statusR) ? (
        <p className="text-lg text-white text-center py-2 w-full">Carregando...</p>
      ) : ['failed'].includes(statusR) ? (
        <p className="text-lg text-white text-center py-2 w-full">{errorR}</p>
      ) : reservasPorData.length === 0 ? (
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
                        onOperacaoSucesso={(reserva, tipo) => setOperacaoSucesso({ reserva, tipo })}
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
          onOperacaoSucesso={(reserva, tipo) => setOperacaoSucesso({ reserva, tipo })}
        >
          <div style={{ display: 'none' }} />
        </DetalhesReservaDialog>
      )}

      {operacaoSucesso && (
        <OperacaoConfirmadaDialog
          reserva={operacaoSucesso.reserva}
          tipo={operacaoSucesso.tipo}
          open={true}
          setOpen={(open) => !open && setOperacaoSucesso(null)}
        />
      )}
    </PageContainer.List>
  );
}