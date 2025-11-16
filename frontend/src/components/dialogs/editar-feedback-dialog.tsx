/**
 * @fileoverview Diálogo para editar feedback existente
 * 
 * Permite que o dono do feedback ou um gerente editem um feedback existente.
 * Clientes podem editar apenas seus próprios feedbacks, enquanto gerentes podem
 * editar qualquer feedback. O campo de pacote é bloqueado para clientes.
 * 
 * @module components/dialogs/EditarFeedbackDialog
 */

import { useState, type ReactNode } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { StarRating } from "../ui/star-rating";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import useCargo from "@/hooks/useCargo";
import { type Feedback } from "@/redux/feedbacks/slice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/root-reducer";
import { updateFeedbackServer } from "@/redux/feedbacks/fetch";
import { type AppDispatch } from "@/redux/store";
import { selectAllPacotes, selectPacoteById } from "@/redux/pacotes/slice";

/**
 * Schema de validação para o formulário de edição de feedback
 * 
 * @constant
 * @type {z.ZodObject}
 * @property {string} pacoteIndex - ID do pacote (obrigatório)
 * @property {number} rating - Avaliação de 1 a 5 estrelas (obrigatório)
 * @property {string} comment - Comentário do feedback (mínimo 10 caracteres)
 */
const formSchema = z.object({
  pacoteIndex: z.string().min(1, "Selecione um pacote"),
  rating: z.number().min(1, "Dê uma avaliação de pelo menos 1 estrela").max(5, "Máximo de 5 estrelas"),
  comment: z.string()
    .min(1, "O comentário é obrigatório")
    .refine(
      (value) => value.trim().length >= 10,
      { message: "O comentário deve ter pelo menos 10 caracteres" }
    )
});

/**
 * Props do diálogo de editar feedback
 * 
 * @interface EditarFeedbackDialogProps
 * @property {Feedback} feedback - Objeto do feedback a editar
 * @property {ReactNode} children - Elemento que dispara a abertura do diálogo
 */
interface EditarFeedbackDialogProps {
  feedback: Feedback
  children: ReactNode
}

/**
 * Diálogo para editar feedback existente
 * 
 * Funcionalidades:
 * - Edição de pacote (apenas gerentes podem mudar)
 * - Reclassificação por estrelas (1-5)
 * - Edição de comentário (mínimo 10 caracteres)
 * - Carregamento de dados atuais do feedback
 * - Controle de acesso baseado em cargo
 * 
 * @component
 * @param {EditarFeedbackDialogProps} props - Props do diálogo
 * @param {Feedback} props.feedback - Dados do feedback a editar
 * @param {ReactNode} props.children - Botão ou elemento que abre o diálogo
 * @returns {JSX.Element} Diálogo com formulário de edição de feedback
 * 
 * @example
 * // Uso do diálogo
 * <EditarFeedbackDialog feedback={feedback}>
 *   <Button size="icon">Editar</Button>
 * </EditarFeedbackDialog>
 */
export const EditarFeedbackDialog = ({ feedback, children }: EditarFeedbackDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { isGerente } = useCargo()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pacoteIndex: String(feedback.pacote.id),
      rating: feedback.rating,
      comment: feedback.comentario
    },
  });

  const dispatch = useDispatch<AppDispatch>()

  const pacotes = useSelector(selectAllPacotes);
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsOpen(false)
    form.reset()

    const pacote = pacotes.find((pacote) => pacote.id === values.pacoteIndex)

    if (!pacote) return

    dispatch(updateFeedbackServer({
      id: feedback.id,
      cliente: feedback.cliente,
      comentario: values.comment,
      rating: values.rating,
      pacote,
    }))

    form.reset(values)
  }

  return (
    <Dialog.Container open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Editar feedback</Dialog.Title>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <FormField
              control={form.control}
              name="pacoteIndex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pacote</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!isGerente()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full disabled:opacity-70">
                        <SelectValue placeholder="Escolher pacote" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pacotes.map((pacote, index) => (
                        <SelectItem key={index} value={String(pacote.id)}>
                          {pacote.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estrelas</FormLabel>
                  <FormControl>
                    <StarRating 
                      rating={field.value} 
                      onRatingChange={field.onChange} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentário</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Seu comentário sobre o pacote..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Dialog.Footer>
              <Dialog.Close asChild>    
                <Button variant="outline" type="button"> 
                  Cancelar
                </Button>
              </Dialog.Close>

              <Button type="submit" className="h-[2.625rem]">
                Salvar
              </Button>
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog.Container>
  )
}