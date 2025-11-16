/**
 * @fileoverview Diálogo de ordenação para feedbacks
 * 
 * Permite ordenar feedbacks por avaliação, nome do cliente ou nome do pacote,
 * em ordem crescente ou decrescente.
 * 
 * @module components/dialogs/OrdenarFeedbacksDialog
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
 * Schema de validação para o formulário de ordenação
 * 
 * @constant
 * @type {z.ZodObject}
 * @property {string} campo - Campo de ordenação: "rating" (avaliação), "cliente" (nome do cliente) ou "pacote" (nome do pacote)
 * @property {string} ordem - Ordem de classificação: "asc" (crescente) ou "desc" (decrescente)
 */
const formSchema = z.object({
  campo: z.enum(["rating", "cliente", "pacote"]),
  ordem: z.enum(["asc", "desc"]),
});

/**
 * Props do diálogo de ordenação de feedbacks
 * 
 * @interface OrdenarFeedbacksDialogProps
 * @property {ReactNode} children - Elemento que dispara a abertura do diálogo
 * @property {Function} onApplySort - Callback com a ordenação aplicada
 */
interface OrdenarFeedbacksDialogProps {
  children: ReactNode
  onApplySort: (sort: z.infer<typeof formSchema>) => void
}

/**
 * Diálogo de ordenação para feedbacks
 * 
 * Oferece opções para:
 * - Campo de ordenação: Avaliação, Cliente ou Pacote
 * - Ordem: Crescente ou Decrescente
 * - Padrão: Avaliação em ordem decrescente (feedback com maiores notas primeiro)
 * 
 * @component
 * @param {OrdenarFeedbacksDialogProps} props - Props do diálogo
 * @param {ReactNode} props.children - Botão ou elemento que abre o diálogo
 * @param {Function} props.onApplySort - Função chamada com a ordenação selecionada
 * @returns {JSX.Element} Diálogo com opções de ordenação
 * 
 * @example
 * // Uso do diálogo
 * <OrdenarFeedbacksDialog onApplySort={setOrdenacao}>
 *   <Button>Ordenar por</Button>
 * </OrdenarFeedbacksDialog>
 */
export const OrdenarFeedbacksDialog = ({ children, onApplySort }: OrdenarFeedbacksDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campo: "rating",
      ordem: "desc",
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
        <Dialog.Title>Ordenar Feedbacks</Dialog.Title>

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
                        <RadioGroupItem value="rating" id="rating" />
                        <label htmlFor="rating" className="text-sm cursor-pointer text-white">Avaliação</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cliente" id="cliente" />
                        <label htmlFor="cliente" className="text-sm cursor-pointer text-white">Cliente</label>
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
