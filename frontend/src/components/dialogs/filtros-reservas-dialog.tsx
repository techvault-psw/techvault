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
  status: z.string().optional(),
  dataInicio: z.date().optional(),
  dataTermino: z.date().optional(),
});

interface FiltrosReservasDialogProps {
  children: ReactNode
  onApplyFilters: (filters: any) => void
}

export const FiltrosReservasDialog = ({ children, onApplyFilters }: FiltrosReservasDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [openDateInicio, setOpenDateInicio] = useState(false)
  const [openDateTermino, setOpenDateTermino] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "Todas",
      dataInicio: undefined,
      dataTermino: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const filters = {
      status: values.status,
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
        <Dialog.Title>Filtros de Reservas</Dialog.Title>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todas">Todas</SelectItem>
                        <SelectItem value="Confirmada">Confirmada</SelectItem>
                        <SelectItem value="Cancelada">Cancelada</SelectItem>
                        <SelectItem value="Concluída">Concluída</SelectItem>
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
