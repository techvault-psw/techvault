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
import { useDispatch, useSelector } from "react-redux";
import { addFeedbackServer } from "@/redux/feedbacks/fetch";
import type { RootState } from "@/redux/root-reducer";
import { useLocation, useNavigate } from "react-router";
import type { AppDispatch } from "@/redux/store";
import { selectAllPacotes } from "@/redux/pacotes/slice";
import { selectAllReservas } from "@/redux/reservas/slice";

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

interface DarFeedbackDialogProps {
  children: ReactNode
}

export const DarFeedbackDialog = ({ children }: DarFeedbackDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const pacotes = useSelector(selectAllPacotes);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pacoteIndex: "",
      rating: 0,
      comment: ""
    },
  });

  const dispatch = useDispatch<AppDispatch>()
  const { clienteAtual, token } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsOpen(false)
    form.reset()

    const pacote = pacotes.find((pacote) => pacote.id === values.pacoteIndex)

    if (!pacote || !clienteAtual) return

    dispatch(addFeedbackServer({
      rating: values.rating,
      comentario: values.comment,
      cliente: clienteAtual,
      pacote,
    }))
  }

  const navigate = useNavigate()
  const location = useLocation()

  const handleOpenChange = (isOpen: boolean) => {
    if (!token) {
      navigate(`/login?redirectTo=${location.pathname}`)
      return
    }

    setIsOpen(isOpen)
  }

  const reservas = useSelector(selectAllReservas);
  const reservasCliente = reservas.filter((reserva) => reserva.cliente.id === clienteAtual?.id)
  const reservasConcluidas = reservasCliente.filter((reserva) => reserva.status === 'Concluída')
  const pacotesReservadosIds = reservasConcluidas.map((reserva) => reserva.pacote.id)
  const pacotesPossiveis = pacotes.filter((pacote) => pacotesReservadosIds.includes(pacote.id))

  return (
    <Dialog.Container open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Dar feedback</Dialog.Title>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            <FormField
              control={form.control}
              name="pacoteIndex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pacote</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Escolher pacote" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pacotesPossiveis.length === 0 ? (
                        <div className="p-2 text-sm text-gray">
                          Você ainda não possui nenhuma reserva concluída
                        </div>
                      ) : (
                        pacotesPossiveis.map((pacote, index) => (
                          <SelectItem key={index} value={String(pacote.id)}>
                            {pacote.name}
                          </SelectItem>
                        ))
                      )}
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
                      placeholder="Deixe seu comentário sobre o pacote..."
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
                Confirmar
              </Button>
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog.Container>
  )
}