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

const formSchema = z.object({
  role: z.string().optional(),
  dataRegistroInicio: z.date().optional(),
  dataRegistroFim: z.date().optional(),
});

interface FiltrosClientesDialogProps {
  children: ReactNode
  onApplyFilters: (filters: any) => void
}

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
