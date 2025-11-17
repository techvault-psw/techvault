/**
 * @fileoverview Dialog para emissão de relatório financeiro com seleção de período
 * 
 * Componente modal que permite ao gerente selecionar um período de datas
 * (data inicial e final) através de date pickers para gerar um relatório
 * detalhado de faturamento e receitas naquele intervalo, incluindo métricas
 * consolidadas e distribuição diária de receitas.
 * 
 * @module components/dialogs/EmitirRelatorioFinanceiroDialog
 */

import { ChevronDownIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import { Dialog } from "../ui/dialog";
import { FormItem } from "../ui/form";
import { Label } from "../ui/input";
import { Separator } from "../ui/separator";
import { RelatorioFinanceiroDialog, type RelatorioFinanceiroData } from "./relatorio-financeiro-dialog";
import { httpGet } from "@/lib/fetch-utils";

/**
 * Schema de validação para o formulário de período do relatório financeiro
 * 
 * Valida que ambas as datas foram preenchidas e que a data inicial
 * não é maior que a data final.
 * 
 * @constant
 * @type {z.ZodObject}
 * @property {Date} dataInicial - Data inicial do período (obrigatória)
 * @property {Date} dataFinal - Data final do período (obrigatória)
 * @validation Data inicial não pode ser maior que data final
 */
const relatorioSchema = z
  .object({
    dataInicial: z.date({ message: "Por favor, preencha ambas as datas" }),
    dataFinal: z.date({ message: "Por favor, preencha ambas as datas" }),
  })
  .refine((data) => data.dataInicial <= data.dataFinal, {
    message: "Data inicial não pode ser maior que data final",
    path: ["dataInicial"],
  });

/**
 * Tipo de dados do formulário de período para relatório financeiro
 * Inferido do schema de validação relatorioSchema usando Zod
 */
type RelatorioFormData = z.infer<typeof relatorioSchema>;

/**
 * Componente de dialog para emitir relatório financeiro
 * 
 * Dialog que permite ao usuário selecionar um período (data inicial e final)
 * através de dois date pickers para gerar um relatório financeiro. Valida
 * que a data inicial não ultrapassa a data final antes de fazer a requisição
 * ao servidor. Abre um dialog secundário (RelatorioFinanceiroDialog) com os
 * dados do relatório gerado se a requisição for bem-sucedida.
 * 
 * Estados gerenciados:
 * - isOpen: abertura/fechamento do dialog de seleção de período
 * - open1, open2: abertura/fechamento dos date pickers
 * - successDialogOpen: abertura/fechamento do dialog de exibição do relatório
 * - relatorioData: dados consolidados do relatório (com datas formatadas)
 * 
 * Realiza conversão de strings de datas para objetos Date para o array
 * de faturamento diário para compatibilidade com o componente de exibição.
 * 
 * @component
 * @param {Object} props - Props do componente
 * @param {ReactNode} props.children - Elemento trigger do dialog (ex: Button)
 * @returns {JSX.Element} Dialog com seleção de período e dialog secundário de exibição
 * 
 * @example
 * <EmitirRelatorioFinanceiroDialog>
 *   <Button>Gerar Relatório Financeiro</Button>
 * </EmitirRelatorioFinanceiroDialog>
 */
export const EmitirRelatorioFinanceiroDialog = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [relatorioData, setRelatorioData] = useState<RelatorioFinanceiroData>({
    totalRecebido: 0,
    quantidadeReservasConcluidas: 0,
    valorMedioReservas: 0,
    faturamentoDiario: []
  })

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<RelatorioFormData>({
    resolver: zodResolver(relatorioSchema),
    mode: "onChange",
  });

  const dataInicial = watch("dataInicial");
  const dataFinal = watch("dataFinal");

  /**
   * Manipula o envio do formulário de período
   * 
   * Requisita o relatório financeiro à API com as datas selecionadas,
   * formata as datas retornadas (strings ISO) em objetos Date, e abre
   * o dialog de exibição. Em caso de erro, apenas registra no console.
   * 
   * @async
   * @param {RelatorioFormData} data - Dados do formulário com datas
   * @returns {Promise<void>}
   */
  const onSubmit = async (data: RelatorioFormData) => {
    try {
      const res = await httpGet<RelatorioFinanceiroData>(`/relatorios/financeiro?dataInicio=${data.dataInicial}&dataTermino=${data.dataFinal}`)      

      const faturamentoDiarioFormatted = res.faturamentoDiario.map(dia => ({
        data: new Date(dia.data),
        quantidadeReservas: dia.quantidadeReservas,
        faturamentoDia: dia.faturamentoDia
      }))

      setRelatorioData({
        ...res,
        faturamentoDiario: faturamentoDiarioFormatted
      })
      setSuccessDialogOpen(true);
    } catch(error) {
      console.log(error)
    }
  };

  /**
   * Manipula a seleção da data inicial através do date picker
   * 
   * @function
   * @param {Date | undefined} date - Data selecionada ou undefined
   * @returns {void}
   */
  const handleDataInicialChange = (date: Date | undefined) => {
    setValue("dataInicial", date as Date, { shouldValidate: true });
  };

  /**
   * Manipula a seleção da data final através do date picker
   * 
   * @function
   * @param {Date | undefined} date - Data selecionada ou undefined
   * @returns {void}
   */
  const handleDataFinalChange = (date: Date | undefined) => {
    setValue("dataFinal", date as Date, { shouldValidate: true });
  };

  const errorMessage = errors.dataInicial?.message || errors.dataFinal?.message

  /**
   * Manipula abertura/fechamento do dialog
   * 
   * Reseta o formulário quando o dialog é fechado para limpar os dados
   * e mensagens de erro da tentativa anterior.
   * 
   * @function
   * @param {boolean} open - Estado desejado do dialog
   * @returns {void}
   */
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)

    if (!open) {
      reset()
    }
  }

  return (
    <>
      <Dialog.Container open={isOpen} onOpenChange={handleOpenChange}>
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>

        <Dialog.Content>
          <Dialog.Title>Relatório Financeiro</Dialog.Title>
          <Separator />
          <Dialog.Description>
            Selecione o período desejado para gerar o relatório financeiro.
          </Dialog.Description>
          <Dialog.Description>
            Esse relatório apresenta os valores recebidos dentro do intervalo selecionado.
          </Dialog.Description>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="w-full flex gap-2 items-start">
              <FormItem className="flex-1">
                <Label htmlFor="dataInicial">Data inicial</Label>
                <DatePicker open={open1} setOpen={setOpen1} date={dataInicial} setDate={handleDataInicialChange}>
                  <Button
                    variant="outline"
                    type="button"
                    id="dataInicial"
                    className={`leading-none w-full px-3 py-2 bg-gray/5 backdrop-blur-sm rounded-lg border text-base flex justify-between ${
                      errorMessage ? "border-red-500" : "border-gray/50"
                    }`}
                  >
                    {dataInicial ? dataInicial.toLocaleDateString() : <span className="text-gray">Escolher data</span>}
                    <ChevronDownIcon />
                  </Button>
                </DatePicker>
              </FormItem>

              <FormItem className="flex-1">
                <Label htmlFor="dataFinal">Data final</Label>
                <DatePicker open={open2} setOpen={setOpen2} date={dataFinal} setDate={handleDataFinalChange}>
                  <Button
                    variant="outline"
                    type="button"
                    id="dataFinal"
                    className={`leading-none w-full px-3 py-2 bg-gray/5 backdrop-blur-sm rounded-lg border text-base flex justify-between ${
                      errorMessage ? "border-red-500" : "border-gray/50"
                    }`}
                  >
                    {dataFinal ? dataFinal.toLocaleDateString() : <span className="text-gray">Escolher data</span>}
                    <ChevronDownIcon />
                  </Button>
                </DatePicker>
              </FormItem>
            </div>

            {errorMessage && (
              <p className="text-red text-sm font-medium leading-none -mt-2">{errorMessage}</p>
            )}

            <Button type="submit" className="font-semibold py-3 w-full">
              Emitir relatório
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Container>

      <RelatorioFinanceiroDialog
        open={successDialogOpen}
        setOpen={setSuccessDialogOpen}
        startDate={dataInicial}
        endDate={dataFinal}
        relatorioData={relatorioData}
      />
    </>
  );
};
