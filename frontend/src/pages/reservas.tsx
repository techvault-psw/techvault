/**
 * @fileoverview Página de gerenciamento de reservas
 * 
 * Página administrativa para visualização e gestão de todas as reservas confirmadas
 * do sistema, organizadas por data com agrupamento de entregas e coletas. Acessível
 * apenas para usuários com perfil de gerente ou suporte.
 * 
 * @module pages/ReservasPage
 */

import { PageContainer } from "@/components/page-container";
import { PageTitle, PageTitleContainer } from "@/components/page-title";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "@/components/icons/filter-icon";
import { SlidersIcon } from "@/components/icons/sliders-icon";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DetalhesReservaDialog } from "@/components/dialogs/detalhes-reserva-dialog";
import { OperacaoConfirmadaDialog } from "@/components/dialogs/operacao-confirmada-dialog";
import { FiltrosOperacoesDialog } from "@/components/dialogs/filtros-operacoes-dialog";
import { OrdenarOperacoesDialog } from "@/components/dialogs/ordenar-operacoes-dialog";
import useCargo from "@/hooks/useCargo";
import { useNavigate, useLocation } from "react-router";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/root-reducer";
import { selectAllReservas, selectReservaById, type Reserva } from "@/redux/reservas/slice";
import { stringifyAddress } from "@/lib/stringify-address";
import { agruparReservasPorData } from "@/lib/agrupar-reservas";
import { type AppDispatch } from "@/redux/store";
import { fetchReservas } from "@/redux/reservas/fetch";
import { GoBackButton } from "@/components/go-back-button";

/**
 * Interface para reserva com tipo de operação
 * 
 * @interface ReservaComTipo
 * @property {Reserva} reserva - Objeto da reserva
 * @property {'Entrega' | 'Coleta'} tipo - Tipo de operação
 * @property {Date} hora - Data e hora da operação
 */
export interface ReservaComTipo {
  reserva: Reserva;
  tipo: 'Entrega' | 'Coleta';
  hora: Date;
}

/**
 * Componente da página de gerenciamento de reservas
 * 
 * Exibe agenda de reservas confirmadas organizadas por data:
 * - Agrupamento por data (Hoje, Amanhã, ou data formatada)
 * - Separação entre entregas e coletas
 * - Filtros de status e período
 * - Confirmação de entregas/coletas via código
 * - Feedback de operações concluídas
 * 
 * Requer permissões de gerente ou suporte - redireciona para /login caso contrário.
 * 
 * @component
 * @returns {JSX.Element} Página de gerenciamento de reservas
 * 
 * @example
 * // Uso no roteamento
 * <Route path="/reservas" element={<ReservasPage />} />
 */
export default function ReservasPage() {
  const { isGerente, isSuporte } = useCargo();
  const dispatch = useDispatch<AppDispatch>();
  const { status: statusR, error: errorR } = useSelector(
    (rootReducer: RootState) => rootReducer.reservasReducer
  );

  useEffect(() => {
    if (["not_loaded", "deleted"].includes(statusR)) {
      dispatch(fetchReservas());
    }
  }, [statusR, dispatch]);

  const reservas = useSelector(selectAllReservas);
  const navigate = useNavigate();
  const location = useLocation();
  const [reservaToOpen, setReservaToOpen] = useState<string | null>(null);
  const [clienteToOpen, setClienteToOpen] = useState<string | null>(null);
  const [operacaoSucesso, setOperacaoSucesso] = useState<{
    reserva: Reserva;
    tipo: "Entrega" | "Coleta";
  } | null>(null);
  const [filtros, setFiltros] = useState<any>({});
  const [ordenacao, setOrdenacao] = useState<any>({
    campo: "hora",
    ordem: "asc",
  });

  useEffect(() => {
    if (!isGerente() && !isSuporte()) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const state = location.state as {
      fromClientDialog?: string;
      fromReservaId?: string;
    } | null;
    if (state?.fromReservaId !== undefined) {
      setReservaToOpen(state.fromReservaId);
    }
    if (state?.fromClientDialog !== undefined) {
      setClienteToOpen(state.fromClientDialog);
    }
  }, [location]);
  
  const reservasFiltradas = useMemo(() => {
    let resultado = reservas.filter((reserva) => reserva.status === "Confirmada");

    if (filtros.status && filtros.status !== "Todas") {
      resultado = resultado.filter(r => r.status === filtros.status);
    }

    if (filtros.dataInicio) {
      resultado = resultado.filter(r => new Date(r.dataInicio) >= new Date(filtros.dataInicio));
    }

    if (filtros.dataTermino) {
      resultado = resultado.filter(r => new Date(r.dataTermino) <= new Date(filtros.dataTermino));
    }

    return resultado;
  }, [reservas, filtros]);

  const reservasPorData = useMemo(() => {
    const agrupadas = agruparReservasPorData(reservasFiltradas);

    return agrupadas
      .map((grupo) => {
        let operacoesFiltradas = grupo.reservas;

        if (filtros.tipo && filtros.tipo !== "Todas") {
          operacoesFiltradas = operacoesFiltradas.filter(
            (op) => op.tipo === filtros.tipo
          );
        }

        const operacoesOrdenadas = [...operacoesFiltradas].sort((a, b) => {
          let valorA: any, valorB: any;

          switch (ordenacao.campo) {
            case "hora":
              valorA = a.hora.getTime();
              valorB = b.hora.getTime();
              break;
            case "tipo":
              valorA = a.tipo === "Entrega" ? 0 : 1;
              valorB = b.tipo === "Entrega" ? 0 : 1;
              break;
            case "endereco":
              valorA = stringifyAddress(a.reserva.endereco);
              valorB = stringifyAddress(b.reserva.endereco);
              break;
            case "pacote":
              valorA = a.reserva.pacote?.name || "";
              valorB = b.reserva.pacote?.name || "";
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

        return {
          ...grupo,
          reservas: operacoesOrdenadas,
        };
      })
      .filter((grupo) => grupo.reservas.length > 0);
  }, [reservasFiltradas, filtros, ordenacao]);
  
  const reservaParaAbrir = useSelector((state: RootState) => 
    reservaToOpen ? selectReservaById(state, reservaToOpen) : null
  )

  return (
    <PageContainer.List> 
      <PageTitleContainer>
        <GoBackButton to='/dashboard' />
        <PageTitle>Reservas</PageTitle>
      </PageTitleContainer>

      <div className="flex items-center gap-4 flex-shrink-0">
        <FiltrosOperacoesDialog onApplyFilters={setFiltros}>
          <Button className="w-40 md:w-52" variant="secondary" size="sm">
            <FilterIcon className="size-4.5" />
            Filtros
          </Button>
        </FiltrosOperacoesDialog>

        <OrdenarOperacoesDialog onApplySort={setOrdenacao}>
          <Button className="w-40 md:w-52" variant="secondary" size="sm">
            <SlidersIcon className="size-4.5" />
            Ordenar por
          </Button>
        </OrdenarOperacoesDialog>
      </div>

      {['loading', 'saving', 'deleting'].includes(statusR) ? (
        <p className="text-lg text-white text-center py-2 w-full">Carregando...</p>
      ) : ['failed'].includes(statusR) ? (
        <p className="text-lg text-white text-center py-2 w-full">{errorR}</p>
      ) : reservasFiltradas.length === 0 && (filtros.status || filtros.dataInicio || filtros.dataTermino) ? (
        <p className="text-base text-white w-full text-center">
          Nenhuma reserva encontrada com os filtros aplicados.
        </p>
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

                              <Badge className="py-0.5" variant={tipo === "Entrega" ? "blue" : "purple"}>
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