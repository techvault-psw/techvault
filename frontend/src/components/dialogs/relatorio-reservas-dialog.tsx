/**
 * @fileoverview Dialog de exibição de relatório de reservas
 * 
 * Componente modal que apresenta um relatório detalhado de todas as reservas
 * realizadas dentro de um período específico, incluindo resumo estatístico
 * e listagem detalhada de cada reserva.
 * 
 * @module components/dialogs/RelatorioReservasDialog
 */

import type { DialogProps } from "@radix-ui/react-dialog";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { type Reserva } from "@/redux/reservas/slice";
import { formatCurrency } from "@/lib/format-currency";

export interface RelatorioReservasData {
  reservas: Reserva[]
  qtdReservasConcluidas: number
  qtdReservasCanceladas: number
}

/**
 * Props do componente RelatorioReservasDialog
 * 
 * @interface RelatorioReservasDialogProps
 * @extends {DialogProps}
 * @property {boolean} open - Estado de abertura do dialog
 * @property {Function} setOpen - Função para alterar o estado de abertura
 * @property {Date} startDate - Data inicial do período do relatório
 * @property {Date} endDate - Data final do período do relatório
 */
interface RelatorioReservasDialogProps extends DialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  startDate: Date;
  endDate: Date;
  relatorioData: RelatorioReservasData
}

/**
 * Calcula o resumo estatístico de um conjunto de reservas
 * 
 * @function
 * @param {Reserva[]} reservas - Array de reservas a serem analisadas
 * @returns {Array<{name: string, count: string}>} Array com estatísticas:
 *   - Quantidade de reservas confirmadas com percentual
 *   - Quantidade de reservas canceladas com percentual
 *   - Quantidade total de reservas
 */
const getResumo: (relatorioData: RelatorioReservasData) => {
  name: string
  count: string
}[] = (data) => {
  const qtdReservas = data.reservas.length
  const reservasConcluidasPercent = Math.floor((data.qtdReservasConcluidas / qtdReservas) * 100)
  const reservasCanceladasPercent = Math.floor((data.qtdReservasCanceladas / qtdReservas) * 100)

  return [
    {
      name: "Reservas concluídas",
      count: `${data.qtdReservasConcluidas} (${isNaN(reservasConcluidasPercent) ? 0 : reservasConcluidasPercent}%)`,
    },
    {
      name: "Reservas canceladas",
      count: `${data.qtdReservasCanceladas} (${isNaN(reservasCanceladasPercent) ? 0 : reservasCanceladasPercent}%)`,
    },
    {
      name: "Reservas totais",
      count: qtdReservas.toString(),
    },
  ]
}

/**
 * Componente de dialog para exibição do relatório de reservas
 * 
 * Apresenta um resumo estatístico das reservas no período (confirmadas, canceladas, total)
 * e lista detalhada de cada reserva com informações como:
 * - Nome do pacote
 * - Cliente responsável
 * - Data e horário de início e término
 * - Status e valor da reserva
 * 
 * Os dados são filtrados por período e apenas reservas finalizadas ou canceladas são listadas.
 * 
 * @component
 * @param {RelatorioReservasDialogProps} props - Props do componente
 * @param {boolean} props.open - Controla abertura/fechamento do dialog
 * @param {Function} props.setOpen - Função para alterar estado de abertura
 * @param {Date} props.startDate - Data inicial do período
 * @param {Date} props.endDate - Data final do período
 * @param {DialogProps} props - Outras props do dialog (passadas adiante)
 * @returns {JSX.Element|null} Dialog com relatório ou null se datas não definidas
 * 
 * @example
 * <RelatorioReservasDialog
 *   open={isOpen}
 *   setOpen={setIsOpen}
 *   startDate={new Date('2024-01-01')}
 *   endDate={new Date('2024-01-31')}
 * />
 */
export const RelatorioReservasDialog = ({ open, setOpen, startDate, endDate, relatorioData, ...props }: RelatorioReservasDialogProps) => {
  if (!startDate || !endDate) return null

  const formattedStartDate = format(startDate, "dd/MM/yyyy")
  const formattedEndDate = format(endDate, "dd/MM/yyyy")

  const resumo = getResumo(relatorioData)

  return (
    <Dialog.Container open={open} onOpenChange={setOpen} {...props}>
      <Dialog.Content className="max-h-150">
        <Dialog.Title>Relatório de Reservas</Dialog.Title>

        <Dialog.Description className="leading-none text-gray -mt-1">Período: {formattedStartDate} a {formattedEndDate}</Dialog.Description>

        <Separator />

        <section className="flex flex-col gap-2">
          <h3 className="font-semibold text-xl text-white mb-1">Resumo</h3>

          {resumo.map(({ name, count }, i) => {
            return (
              <>
                <div className="flex justify-between text-gray leading-none">
                  <p>{name}</p><p>{count}</p>
                </div>
                {i != resumo.length - 1 && <Separator />}
              </>
            )
          })}
        </section>

        {relatorioData.reservas.length !== 0 && (
          <section className="flex flex-col gap-2 overflow-y-hidden">
            <h3 className="font-semibold text-xl text-white mb-1.5">Detalhes</h3>

            <div className="flex flex-col gap-2 scrollbar">
              {relatorioData.reservas.map((reserva) => {
                const formattedReservaStartDate = format(new Date(reserva.dataInicio), "dd/MM/yyyy HH:mm")
                const formattedReservaEndDate = format(new Date(reserva.dataTermino), "dd/MM/yyyy HH:mm")

                return (
                  <div className="w-full p-2 flex justify-between gap-1 bg-white/5 border border-gray/50 rounded-lg backdrop-blur-sm transition-colors duration-200">
                    <div className="text-white text-sm truncate flex flex-col gap-2">
                      <p className="leading-none"><span className="font-semibold">Pacote:</span> {reserva.pacote.name}</p>
                      <p className="leading-none"><span className="font-semibold">Cliente:</span> {reserva.cliente.name}</p>
                      <p className="leading-none"><span className="font-semibold">Data:</span> {formattedReservaStartDate} - {formattedReservaEndDate}</p>
                    </div>
                    <div className="flex flex-col justify-between leading-none text-white text-sm font-semibold">
                      {reserva.status === 'Cancelada' ? (
                        <Badge className="py-0.5" variant="red">Cancelada</Badge>
                      ) : (
                        <Badge className="py-0.5" variant="purple">Concluída</Badge>
                      )}
                      <p className="text-right mt-auto">{formatCurrency(reserva.valor)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </Dialog.Content>
    </Dialog.Container>
  );
};
