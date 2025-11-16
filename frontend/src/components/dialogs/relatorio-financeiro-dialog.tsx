/**
 * @fileoverview Dialog de exibição de relatório financeiro
 * 
 * Componente modal que apresenta um relatório detalhado de faturamento
 * dentro de um período específico, incluindo resumo consolidado e
 * distribuição diária de receitas.
 * 
 * @module components/dialogs/RelatorioFinanceiroDialog
 */

import type { DialogProps } from "@radix-ui/react-dialog";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { selectAllReservas, type Reserva } from "@/redux/reservas/slice";
import { formatCurrency } from "@/lib/format-currency";

/**
 * Props do componente RelatorioFinanceiroDialog
 * 
 * @interface RelatorioFinanceiroDialogProps
 * @extends {DialogProps}
 * @property {boolean} open - Estado de abertura do dialog
 * @property {Function} setOpen - Função para alterar o estado de abertura
 * @property {Date} startDate - Data inicial do período do relatório
 * @property {Date} endDate - Data final do período do relatório
 */
interface RelatorioFinanceiroDialogProps extends DialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  startDate: Date;
  endDate: Date;
}

/**
 * Calcula o resumo financeiro consolidado de um conjunto de reservas
 * 
 * @function
 * @param {Reserva[]} reservas - Array de reservas concluídas a serem analisadas
 * @returns {Array<{name: string, count: string}>} Array com métricas:
 *   - Faturamento total em formato de moeda
 *   - Quantidade de reservas concluídas
 *   - Ticket médio por reserva em formato de moeda
 */
const getResumo = (reservas: Reserva[]) => {
  const reservasConcluidas = reservas.filter((reserva) => reserva.status === 'Concluída')
  const faturamentoTotal = reservasConcluidas.reduce((acc, reserva) => acc + reserva.valor, 0)
  const ticketMedio = reservasConcluidas.length > 0 ? faturamentoTotal / reservasConcluidas.length : 0

  return [
    {
      name: "Faturamento total",
      count: formatCurrency(faturamentoTotal),
    },
    {
      name: "Reservas concluídas",
      count: reservasConcluidas.length.toString(),
    },
    {
      name: "Ticket médio por reserva",
      count: formatCurrency(ticketMedio),
    },
  ]
}

/**
 * Agrupa e ordena reservas por dia, calculando totais diários
 * 
 * @function
 * @param {Reserva[]} reservas - Array de reservas concluídas
 * @returns {Array<{data: string, qtdReservas: number, valor: number}>} Array ordenado 
 *   cronologicamente com quantidade de reservas e valor total por dia
 */
const getDistribuicaoDiaria = (reservas: Reserva[]) => {
  const agrupadoPorDia = reservas.reduce((acc, reserva) => {
    const dataInicio = format(new Date(reserva.dataInicio), "dd/MM/yyyy")
    
    if (!acc[dataInicio]) {
      acc[dataInicio] = {
        data: dataInicio,
        qtdReservas: 0,
        valor: 0,
      }
    }
    
    acc[dataInicio].qtdReservas += 1
    acc[dataInicio].valor += reserva.valor
    
    return acc
  }, {} as Record<string, { data: string; qtdReservas: number; valor: number }>)

  return Object.values(agrupadoPorDia).sort((a, b) => {
    const [diaA, mesA, anoA] = a.data.split('/').map(Number)
    const [diaB, mesB, anoB] = b.data.split('/').map(Number)
    const dateA = new Date(anoA, mesA - 1, diaA)
    const dateB = new Date(anoB, mesB - 1, diaB)
    return dateA.getTime() - dateB.getTime()
  })
}

/**
 * Componente de dialog para exibição do relatório financeiro
 * 
 * Apresenta um resumo consolidado de faturamento (total, quantidade de reservas, ticket médio)
 * e tabela com distribuição diária de receitas. Apenas reservas concluídas são consideradas
 * no cálculo dos valores.
 * 
 * @component
 * @param {RelatorioFinanceiroDialogProps} props - Props do componente
 * @param {boolean} props.open - Controla abertura/fechamento do dialog
 * @param {Function} props.setOpen - Função para alterar estado de abertura
 * @param {Date} props.startDate - Data inicial do período
 * @param {Date} props.endDate - Data final do período
 * @param {DialogProps} props - Outras props do dialog (passadas adiante)
 * @returns {JSX.Element|null} Dialog com relatório ou null se datas não definidas
 * 
 * @example
 * <RelatorioFinanceiroDialog
 *   open={isOpen}
 *   setOpen={setIsOpen}
 *   startDate={new Date('2024-01-01')}
 *   endDate={new Date('2024-01-31')}
 * />
 */
export const RelatorioFinanceiroDialog = ({ open, setOpen, startDate, endDate, ...props }: RelatorioFinanceiroDialogProps) => {
  if (!startDate || !endDate) return null
  
  const formattedStartDate = format(startDate, "dd/MM/yyyy")
  const formattedEndDate = format(endDate, "dd/MM/yyyy")

  const reservas = useSelector(selectAllReservas)
  const reservasDoPeriodo = reservas.filter((reserva) => {
    const dataReserva = new Date(reserva.dataInicio)
    return dataReserva >= startDate && dataReserva <= endDate
  })
  const reservasConcluidas = reservasDoPeriodo.filter((reserva) => reserva.status === 'Concluída')
  
  const resumo = getResumo(reservasConcluidas)
  const distribuicaoDiaria = getDistribuicaoDiaria(reservasConcluidas)

  return (
    <Dialog.Container open={open} onOpenChange={setOpen} {...props}>
      <Dialog.Content className="max-h-150">
        <Dialog.Title>Relatório Financeiro</Dialog.Title>

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

        {distribuicaoDiaria.length > 0 && (
          <section className="flex flex-col gap-2 overflow-y-hidden">
            <h3 className="font-semibold text-xl text-white mb-1.5">Distribuição por Dia</h3>

            <div className="flex flex-col gap-2 scrollbar">
              <table className="w-full text-gray text-sm">
                <thead>
                  <tr className="text-sm border-b border-gray text-white">
                    <td className="pb-1">
                      Data
                    </td>
                    <td className="pb-1 text-center">
                      Qtd Reservas
                    </td>
                    <td className="pb-1 text-right">
                      Faturamento <span>(R$)</span>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {distribuicaoDiaria.map((dia) => (
                    <tr key={dia.data}>
                      <td className="pt-1">
                        {dia.data}
                      </td>
                      <td className="pt-1 text-center">
                        {dia.qtdReservas}
                      </td>
                      <td className="pt-1 text-right">
                        {formatCurrency(dia.valor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </Dialog.Content>
    </Dialog.Container>
  );
};