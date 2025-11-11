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
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  valorMin: z.string().optional(),
  valorMax: z.string().optional(),
});

interface FiltrosPacotesDialogProps {
  children: ReactNode
  onApplyFilters: (filters: z.infer<typeof formSchema>) => void
}

export const FiltrosPacotesDialog = ({ children, onApplyFilters }: FiltrosPacotesDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valorMin: "",
      valorMax: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onApplyFilters(values)
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
        <Dialog.Title>Filtros de Pacotes</Dialog.Title>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="valorMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Mínimo (hora)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valorMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Máximo (hora)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
