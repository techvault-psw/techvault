/**
 * @fileoverview Dialog de filtros para lista de clientes
 * 
 * Componente de diálogo modal que permite aplicar filtros avançados
 * na lista de clientes por cargo e período de cadastro.
 * 
 * @module components/dialogs/FiltrosClientesDialog
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
 * Schema de validação para filtros de clientes
 * 
 * @constant
 * @type {z.ZodObject}
 * @property {string} [role] - Cargo do cliente (opcional)
 * @property {Date} [dataRegistroInicio] - Data inicial do período de cadastro (opcional)
 * @property {Date} [dataRegistroFim] - Data final do período de cadastro (opcional)
 */
const formSchema = z.object({
  role: z.string().optional(),
  dataRegistroInicio: z.date().optional(),
  dataRegistroFim: z.date().optional(),
});

/**
 * Props do componente FiltrosClientesDialog
 * 
 * @interface FiltrosClientesDialogProps
 * @property {ReactNode} children - Elemento que abrirá o dialog quando clicado
 * @property {Function} onApplyFilters - Callback executado ao aplicar filtros
 */
interface FiltrosClientesDialogProps {
  children: ReactNode
  onApplyFilters: (filters: any) => void
}

/**
 * Componente de diálogo de filtros de clientes
 * 
 * Permite filtrar a lista de clientes por:
 * - Cargo (Todos, Cliente, Gerente, Suporte)
 * - Data de cadastro inicial
 * - Data de cadastro final
 * 
 * Oferece opção para limpar todos os filtros aplicados.
 * 
 * @component
 * @param {FiltrosClientesDialogProps} props - Props do componente
 * @param {ReactNode} props.children - Elemento trigger que abre o diálogo
 * @param {Function} props.onApplyFilters - Callback com filtros selecionados
 * @returns {JSX.Element} Diálogo de filtros de clientes
 * 
 * @example
 * <FiltrosClientesDialog onApplyFilters={setFiltros}>
 *   <Button variant="secondary">
 *     <FilterIcon />
 *     Filtros
 *   </Button>
 * </FiltrosClientesDialog>
 */
export const FiltrosClientesDialog = ({ children, onApplyFilters }: FiltrosClientesDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [openDateInicio, setOpenDateInicio] = useState(false)
  const [openDateFim, setOpenDateFim] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "Todos",
      dataRegistroInicio: undefined,
      dataRegistroFim: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const filters = {
      role: values.role,
      dataRegistroInicio: values.dataRegistroInicio?.toISOString(),
      dataRegistroFim: values.dataRegistroFim?.toISOString(),
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
        <Dialog.Title>Filtros de Clientes</Dialog.Title>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todos">Todos</SelectItem>
                        <SelectItem value="Cliente">Cliente</SelectItem>
                        <SelectItem value="Gerente">Gerente</SelectItem>
                        <SelectItem value="Suporte">Suporte</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataRegistroInicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Cadastro (A partir de)</FormLabel>
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
              name="dataRegistroFim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Cadastro (Até)</FormLabel>
                  <FormControl>
                    <DatePicker
                      open={openDateFim}
                      setOpen={setOpenDateFim}
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
