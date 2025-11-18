/**
 * @fileoverview Dialog de ordenação de operações (entregas e coletas)
 * 
 * Componente de dialog para configuração de ordenação em listagens de operações,
 * permitindo ordenar por diferentes campos e direções.
 * 
 * @module components/dialogs/OrdenarOperacoesDialog
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
} from "../ui/form";
import { Separator } from "../ui/separator";
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

/**
 * Schema de validação para configuração de ordenação
 * 
 * @constant
 * @type {z.ZodObject}
 * @property {string} campo - Campo para ordenar (hora, tipo, endereco, pacote)
 * @property {string} ordem - Direção da ordenação (asc ou desc)
 */
const formSchema = z.object({
  campo: z.enum(["hora", "tipo", "endereco", "pacote"]),
  ordem: z.enum(["asc", "desc"]),
});

/**
 * Props do componente OrdenarOperacoesDialog
 * 
 * @interface OrdenarOperacoesDialogProps
 * @property {ReactNode} children - Elemento trigger que abre o dialog
 * @property {Function} onApplySort - Callback executado ao aplicar ordenação
 */
interface OrdenarOperacoesDialogProps {
  children: ReactNode
  onApplySort: (sort: z.infer<typeof formSchema>) => void
}

/**
 * Componente Dialog de ordenação de operações
 * 
 * Exibe formulário para configuração de ordenação:
 * - Seleção de campo (Horário, Tipo, Endereço, Pacote)
 * - Seleção de ordem (Crescente ou Decrescente)
 * - Botão para aplicar ordenação
 * 
 * @component
 * @param {OrdenarOperacoesDialogProps} props - Props do componente
 * @param {ReactNode} props.children - Trigger
 * @param {Function} props.onApplySort - Callback com configuração de ordenação
 * @returns {JSX.Element} Dialog de ordenação
 * 
 * @example
 * <OrdenarOperacoesDialog onApplySort={setOrdenacao}>
 *   <Button>Ordenar por</Button>
 * </OrdenarOperacoesDialog>
 */
export const OrdenarOperacoesDialog = ({ children, onApplySort }: OrdenarOperacoesDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campo: "hora",
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
        <Dialog.Title>Ordenar Operações</Dialog.Title>

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
                        <RadioGroupItem value="hora" id="hora" />
                        <label htmlFor="hora" className="text-sm cursor-pointer text-white">Horário</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tipo" id="tipo" />
                        <label htmlFor="tipo" className="text-sm cursor-pointer text-white">Tipo (Entrega/Coleta)</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="endereco" id="endereco" />
                        <label htmlFor="endereco" className="text-sm cursor-pointer text-white">Endereço</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pacote" id="pacote" />
                        <label htmlFor="pacote" className="text-sm cursor-pointer text-white">Pacote</label>
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
