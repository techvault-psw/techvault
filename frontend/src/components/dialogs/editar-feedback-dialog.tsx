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
import { pacotes } from "@/consts/pacotes";
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
import type { Feedback } from "@/consts/feedbacks";
import useCargo from "@/hooks/useCargo";

const formSchema = z.object({
  pacoteName: z.string()
    .min(1, { message: "Selecione um pacote" })
    .refine(
        (pacote) => pacotes.some(e => e.name === pacote),
        { message: "Pacote inválido" }
    ),
  rating: z.number().min(1, "Dê uma avaliação de pelo menos 1 estrela").max(5, "Máximo de 5 estrelas"),
  comment: z.string()
    .min(1, "O comentário é obrigatório")
    .refine(
      (value) => value.trim().length >= 10,
      { message: "O comentário deve ter pelo menos 10 caracteres" }
    )
});

interface EditarFeedbackDialogProps {
  feedback: Feedback
  children: ReactNode
}

export const EditarFeedbackDialog = ({ feedback, children }: EditarFeedbackDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { isGerente } = useCargo()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pacoteName: pacotes[feedback.pacoteIndex].name,
      rating: feedback.nota,
      comment: feedback.descricao
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsOpen(false)
    form.reset()
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
              name="pacoteName"
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
                        <SelectItem key={index} value={pacote.name}>
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