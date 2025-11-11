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
} from "../ui/form";
import { Separator } from "../ui/separator";
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const formSchema = z.object({
  campo: z.enum(["name", "email", "phone", "registrationDate", "role"]),
  ordem: z.enum(["asc", "desc"]),
});

interface OrdenarClientesDialogProps {
  children: ReactNode
  onApplySort: (sort: z.infer<typeof formSchema>) => void
}

export const OrdenarClientesDialog = ({ children, onApplySort }: OrdenarClientesDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campo: "name",
      ordem: "asc",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onApplySort(values)
    setIsOpen(false)
  }

  return (
    <Dialog.Container open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Ordenar Clientes</Dialog.Title>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="campo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ordenar por</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="name" id="name" />
                        <label htmlFor="name" className="text-sm cursor-pointer text-white">Nome</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email" />
                        <label htmlFor="email" className="text-sm cursor-pointer text-white">E-mail</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phone" id="phone" />
                        <label htmlFor="phone" className="text-sm cursor-pointer text-white">Telefone</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="registrationDate" id="registrationDate" />
                        <label htmlFor="registrationDate" className="text-sm cursor-pointer text-white">Data de Cadastro</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="role" id="role" />
                        <label htmlFor="role" className="text-sm cursor-pointer text-white">Cargo</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ordem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ordem</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="asc" id="asc" />
                        <label htmlFor="asc" className="text-sm cursor-pointer text-white">Crescente</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="desc" id="desc" />
                        <label htmlFor="desc" className="text-sm cursor-pointer text-white">Decrescente</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <Dialog.Footer>
              <Button type="submit">
                Aplicar Ordenação
              </Button>
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog.Container>
  );
};
