/**
 * @fileoverview Dialog de filtros de operações (entregas e coletas)
 * 
 * Componente de dialog para aplicação de filtros em operações de reservas,
 * permitindo filtragem por tipo de operação e intervalo de datas.
 * 
 * @module components/dialogs/FiltrosOperacoesDialog
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Separator } from "../ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DatePicker } from "../ui/date-picker";
import { ChevronDownIcon } from "lucide-react";

/**
 * Schema de validação para os filtros
 * 
 * @constant
 * @type {z.ZodObject}
 * @property {string} [tipo] - Tipo de operação (Todas, Entrega, Coleta)
 * @property {Date} [dataInicio] - Data de início mínima
 * @property {Date} [dataTermino] - Data de término máxima
 */
const formSchema = z.object({
  tipo: z.string().optional(),
  dataInicio: z.date().optional(),
  dataTermino: z.date().optional(),
});

/**
 * Props do componente FiltrosOperacoesDialog
 * 
 * @interface FiltrosOperacoesDialogProps
 * @property {ReactNode} children - Elemento trigger que abre o dialog
 * @property {Function} onApplyFilters - Callback executado ao aplicar filtros
 */
interface FiltrosOperacoesDialogProps {
  children: ReactNode
  onApplyFilters: (filters: any) => void
}

/**
 * Componente Dialog de filtros de operações
 * 
 * Exibe formulário para filtragem de operações:
 * - Filtro por tipo (Todas, Entrega, Coleta)
 * - Filtro por data de início (a partir de)
 * - Filtro por data de término (até)
 * - Botão para limpar todos os filtros
 * - Botão para aplicar filtros
 * 
 * @component
 * @param {FiltrosOperacoesDialogProps} props - Props do componente
 * @param {ReactNode} props.children - Trigger
 * @param {Function} props.onApplyFilters - Callback com filtros aplicados
 * @returns {JSX.Element} Dialog de filtros
 * 
 * @example
 * <FiltrosOperacoesDialog onApplyFilters={setFiltros}>
 *   <Button>Filtros</Button>
 * </FiltrosOperacoesDialog>
 */
export const FiltrosOperacoesDialog = ({ children, onApplyFilters }: FiltrosOperacoesDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [openDateInicio, setOpenDateInicio] = useState(false)
  const [openDateTermino, setOpenDateTermino] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "Todas",
      dataInicio: undefined,
      dataTermino: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const filters = {
      tipo: values.tipo,
      dataInicio: values.dataInicio?.toISOString(),
      dataTermino: values.dataTermino?.toISOString(),
    }
    onApplyFilters(filters)
    setIsOpen(false)
  }

  function handleClearFilters() {
    form.reset()
    onApplyFilters({})
    setIsOpen(false)
  }

  return (
    <Dialog.Container open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Filtros de Operações</Dialog.Title>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Operação</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todas">Todas</SelectItem>
                        <SelectItem value="Entrega">Entrega</SelectItem>
                        <SelectItem value="Coleta">Coleta</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataInicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Início (A partir de)</FormLabel>
                  <FormControl>
                    <DatePicker
                      open={openDateInicio}
                      setOpen={setOpenDateInicio}
                      date={field.value}
                      setDate={field.onChange}
                    >
                      <Button
                        variant="outline"
                        type="button"
                        className="leading-none w-full px-3 py-2 bg-gray/5 backdrop-blur-sm rounded-lg border border-gray/50 text-base flex justify-between"
                      >
                        {field.value ? field.value.toLocaleDateString() : <span className="text-gray">Escolher data</span>}
                        <ChevronDownIcon />
                      </Button>
                    </DatePicker>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataTermino"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Término (Até)</FormLabel>
                  <FormControl>
                    <DatePicker
                      open={openDateTermino}
                      setOpen={setOpenDateTermino}
                      date={field.value}
                      setDate={field.onChange}
                    >
                      <Button
                        variant="outline"
                        type="button"
                        className="leading-none w-full px-3 py-2 bg-gray/5 backdrop-blur-sm rounded-lg border border-gray/50 text-base flex justify-between"
                      >
                        {field.value ? field.value.toLocaleDateString() : <span className="text-gray">Escolher data</span>}
                        <ChevronDownIcon />
                      </Button>
                    </DatePicker>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Dialog.Footer>
              <Button type="button" variant="outline" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
              <Button type="submit">
                Aplicar Filtros
              </Button>
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog.Container>
  );
};
