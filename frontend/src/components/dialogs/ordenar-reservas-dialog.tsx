/**
 * @fileoverview Dialog de ordenação de reservas
 * 
 * Componente de dialog para configuração de ordenação em listagens de reservas,
 * permitindo ordenar por diferentes campos e direções.
 * 
 * @module components/dialogs/OrdenarReservasDialog
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
 * @property {string} campo - Campo para ordenar (dataInicio, dataTermino, valor, status, pacote)
 * @property {string} ordem - Direção da ordenação (asc ou desc)
 */
const formSchema = z.object({
  campo: z.enum(["dataInicio", "dataTermino", "valor", "status", "pacote"]),
  ordem: z.enum(["asc", "desc"]),
});

/**
 * Props do componente OrdenarReservasDialog
 * 
 * @interface OrdenarReservasDialogProps
 * @property {ReactNode} children - Elemento trigger que abre o dialog
 * @property {Function} onApplySort - Callback executado ao aplicar ordenação
 */
interface OrdenarReservasDialogProps {
  children: ReactNode
  onApplySort: (sort: z.infer<typeof formSchema>) => void
}

/**
 * Componente Dialog de ordenação de reservas
 * 
 * Exibe formulário para configuração de ordenação:
 * - Seleção de campo (Data de Início, Data de Término, Valor, Status, Pacote)
 * - Seleção de ordem (Crescente ou Decrescente)
 * - Botão para aplicar ordenação
 * 
 * @component
 * @param {OrdenarReservasDialogProps} props - Props do componente
 * @param {ReactNode} props.children - Trigger
 * @param {Function} props.onApplySort - Callback com configuração de ordenação
 * @returns {JSX.Element} Dialog de ordenação
 * 
 * @example
 * <OrdenarReservasDialog onApplySort={setOrdenacao}>
 *   <Button>Ordenar por</Button>
 * </OrdenarReservasDialog>
 */
export const OrdenarReservasDialog = ({ children, onApplySort }: OrdenarReservasDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campo: "dataInicio",
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
        <Dialog.Title>Ordenar Reservas</Dialog.Title>

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
                        <RadioGroupItem value="dataInicio" id="dataInicio" />
                        <label htmlFor="dataInicio" className="text-sm cursor-pointer text-white">Data de Início</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dataTermino" id="dataTermino" />
                        <label htmlFor="dataTermino" className="text-sm cursor-pointer text-white">Data de Término</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="valor" id="valor" />
                        <label htmlFor="valor" className="text-sm cursor-pointer text-white">Valor</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="status" id="status" />
                        <label htmlFor="status" className="text-sm cursor-pointer text-white">Status</label>
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
