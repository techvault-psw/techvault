/**
 * @fileoverview Dialog de exibição de relatório financeiro
 * 
 * Componente modal que apresenta um relatório detalhado de faturamento
 * dentro de um período específico, incluindo resumo consolidado com métricas
 * gerais (faturamento total, quantidade de reservas concluídas, ticket médio)
 * e tabela com distribuição diária de receitas em formato de moeda.
 * 
 * @module components/dialogs/RelatorioFinanceiroDialog
 */

import type { DialogProps } from "@radix-ui/react-dialog";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/format-currency";

/**
 * Representa um dia de faturamento com dados agregados
 * 
 * @interface FaturamentoDiario
 * @property {Date} data - Data do faturamento em formato ISO
 * @property {number} quantidadeReservas - Quantidade de reservas concluídas neste dia
 * @property {number} faturamentoDia - Valor total faturado neste dia em reais
 */
interface FaturamentoDiario {
  data: Date,
  quantidadeReservas: number,
  faturamentoDia: number
}

/**
 * Dados consolidados do relatório financeiro para um período específico
 * 
 * @interface RelatorioFinanceiroData
 * @property {number} totalRecebido - Valor total recebido no período (apenas reservas concluídas)
 * @property {number} quantidadeReservasConcluidas - Total de reservas com status concluída
 * @property {number} valorMedioReservas - Valor médio de cada reserva concluída (arredondado a 2 casas decimais)
 * @property {FaturamentoDiario[]} faturamentoDiario - Distribuição diária de faturamento ordenada cronologicamente
 */
export interface RelatorioFinanceiroData {
  totalRecebido: number,
  quantidadeReservasConcluidas: number,
  valorMedioReservas: number,
  faturamentoDiario: FaturamentoDiario[]
}

/**
 * Props do componente RelatorioFinanceiroDialog
 * 
 * @interface RelatorioFinanceiroDialogProps
 * @extends {DialogProps}
 * @property {boolean} open - Controla abertura/fechamento do dialog
 * @property {Function} setOpen - Função para alterar o estado de abertura do dialog
 * @property {Date} startDate - Data inicial do período do relatório
 * @property {Date} endDate - Data final do período do relatório
 * @property {RelatorioFinanceiroData} relatorioData - Dados consolidados do relatório financeiro
 */
interface RelatorioFinanceiroDialogProps extends DialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  startDate: Date;
  endDate: Date;
  relatorioData: RelatorioFinanceiroData;
}

/**
 * Calcula o resumo financeiro consolidado para exibição no relatório
 * 
 * Transforma os dados do relatório em um array de métricas formatadas
 * para apresentação visual (valores em moeda formatada, quantidade como número).
 * 
 * @function
 * @param {RelatorioFinanceiroData} relatorioData - Dados do relatório financeiro
 * @returns {Array<{name: string, count: string | number}>} Array com 3 métricas ordenadas:
 *   - Faturamento total em formato de moeda brasileira
 *   - Quantidade de reservas concluídas (número inteiro)
 *   - Ticket médio por reserva em formato de moeda brasileira
 * 
 * @example
 * const resumo = getResumo(relatorioData)
 * // Retorna: [
 * //   { name: "Faturamento total", count: "R$ 10.500,00" },
 * //   { name: "Reservas concluídas", count: 15 },
 * //   { name: "Ticket médio por reserva", count: "R$ 700,00" }
 * // ]
 */
const getResumo = (relatorioData: RelatorioFinanceiroData) => {
  const quantidadeReservasConcluidas = relatorioData.quantidadeReservasConcluidas
  const faturamentoTotal = relatorioData.totalRecebido
  const ticketMedio = relatorioData.valorMedioReservas

  return [
    {
      name: "Faturamento total",
      count: formatCurrency(faturamentoTotal),
    },
    {
      name: "Reservas concluídas",
      count: quantidadeReservasConcluidas,
    },
    {
      name: "Ticket médio por reserva",
      count: formatCurrency(ticketMedio),
    },
  ]
}

/**
 * Componente de dialog para exibição do relatório financeiro
 * 
 * Componente modal que apresenta um resumo consolidado de faturamento com 3 métricas
 * (faturamento total, quantidade de reservas concluídas, ticket médio) e uma tabela
 * com distribuição diária de receitas. Todas as datas são formatadas no padrão brasileiro.
 * 
 * Apenas reservas com status 'Concluída' são consideradas nos cálculos. O dialog não
 * é renderizado se as datas não forem fornecidas.
 * 
 * @component
 * @param {RelatorioFinanceiroDialogProps} props - Props do componente
 * @param {boolean} props.open - Controla abertura/fechamento do dialog
 * @param {Function} props.setOpen - Função para alterar o estado de abertura
 * @param {Date} props.startDate - Data inicial do período a ser reportado
 * @param {Date} props.endDate - Data final do período a ser reportado
 * @param {RelatorioFinanceiroData} props.relatorioData - Dados consolidados do relatório
 * @returns {JSX.Element|null} Dialog com o relatório formatado ou null se datas inválidas
 * 
 * @example
 * <RelatorioFinanceiroDialog
 *   open={isOpen}
 *   setOpen={setIsOpen}
 *   startDate={new Date('2024-01-01')}
 *   endDate={new Date('2024-01-31')}
 *   relatorioData={{
 *     totalRecebido: 10500,
 *     quantidadeReservasConcluidas: 15,
 *     valorMedioReservas: 700,
 *     faturamentoDiario: [...]
 *   }}
 * />
 */
export const RelatorioFinanceiroDialog = ({ open, setOpen, startDate, endDate, relatorioData, ...props }: RelatorioFinanceiroDialogProps) => {
  if (!startDate || !endDate) return null
  
  const formattedStartDate = format(startDate, "dd/MM/yyyy")
  const formattedEndDate = format(endDate, "dd/MM/yyyy")
  
  const resumo = getResumo(relatorioData)

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

        {relatorioData.faturamentoDiario.length > 0 && (
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
                  {relatorioData.faturamentoDiario.map((dia) => (
                    <tr key={dia.data.toLocaleDateString()}>
                      <td className="pt-1">
                        {dia.data.toLocaleDateString()}
                      </td>
                      <td className="pt-1 text-center">
                        {dia.quantidadeReservas}
                      </td>
                      <td className="pt-1 text-right">
                        {formatCurrency(dia.faturamentoDia)}
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
