import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Reserva } from "@/consts/reservas";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowLeft, Pen, Pencil, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input, Label } from "../ui/input";
import { Card } from "../ui/card";
import { pacotes } from "@/consts/pacotes";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTimePicker } from "../ui/datetime-picker";
import { CancelarReservaDialog } from "./cancelar-reserva-dialog";
import { clientes } from "@/consts/clientes";
import useCargo from "@/hooks/useCargo";

interface DetalhesReservaDialogProps {
  reserva: Reserva
  tipo?: 'Entrega' | 'Coleta'
  children: ReactNode
}

const formSchema = z
    .object({
        dataHoraInicial: z.date({message: "Por favor, preencha a data inicial"}),
        dataHoraFinal: z.date({message: "Por favor, preencha a data final"}),
    })
    .refine((data) => data.dataHoraInicial <= data.dataHoraFinal, {
        message: "Data final não pode ser antes que a data inicial",
        path: ["dataHoraFinal"],
    });

type FormData = z.infer<typeof formSchema>;

export const DetalhesReservaDialog = ({ reserva, tipo, children }: DetalhesReservaDialogProps) => {
  const [isEditting, setIsEditting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const { isGerente, isSuporte } = useCargo()
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataHoraInicial: reserva.dataInicio,
      dataHoraFinal: reserva.dataTermino,
    },
    mode: "onChange"
  })

  const onSubmit = () => {
    setIsEditting(false)
  }

  return (
    <Dialog.Container open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title className="text-xl font-bold">Informações da Reserva</Dialog.Title>
        
        <Separator />
        
        <div className="flex gap-3 justify-between">
          <div className={cn("w-full grid gap-3", tipo ? "grid-cols-2" : "grid-cols-1")}>
            {tipo && (
              <FormItem>
                <Label>Tipo</Label>
                <Input
                  disabled
                  type="text"
                  value={tipo}
                />
              </FormItem>
            )}

            <FormItem>
              <Label>Preço Total Pago</Label>
              <Input
                disabled
                type="text"
                value={formatCurrency(reserva.valor)}
              />
            </FormItem>
          </div>
        </div>

        {/* TODO: Dialog de Pacote */}
        <FormItem>
          <Label>Pacote</Label>
          <Card.Container>
            <Card.Title>
              {pacotes[reserva.pacoteIndex].name}
            </Card.Title>
          </Card.Container>
        </FormItem>

        {/* TODO: Dialog de Endereço */}
        <FormItem>
          <Label>Endereço</Label>
          <Card.Container>
            <Card.Title>
              {reserva.endereco}
            </Card.Title>
          </Card.Container>
        </FormItem>

        {/* TODO: Dialog de Cliente */}
        <FormItem>
          <Label>Cliente</Label>
          <Card.Container>
            <Card.Title>
              João Silva
            </Card.Title>
          </Card.Container>
        </FormItem>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="dataHoraInicial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data e Hora de Início</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      minuteStep={1}
                      disabled={!isEditting}
                      placeholder="Selecione uma data"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataHoraFinal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data e Hora de Término</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      minuteStep={1}
                      disabled={!isEditting}
                      placeholder="Selecione uma data"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Dialog.Footer className="block space-y-3">
              {isEditting ? (
                <Button type="submit" className="h-[2.625rem] w-full">
                  Salvar alterações
                </Button>
              ) : isGerente() && (
                <div className="w-full flex gap-3 items-center">
                  <CancelarReservaDialog
                    cliente={clientes[0]}
                    handleCancelClick={() => setIsOpen(false)}
                    reserva={reserva}
                  >
                    <Button variant="destructive">
                      <X className="size-4"/>
                      Cancelar
                    </Button>
                  </CancelarReservaDialog>

                  <Button variant="outline" onClick={() => setIsEditting(true)}>
                    <Pen className="size-4" />
                    Editar
                  </Button>
                </div>
              )}

              {/* TODO: Pop-up de confirmar entrega */}
              { isSuporte() &&
                <Button className="w-full">
                  Confirmar Entrega
                </Button>
              }

              <Dialog.Close asChild>
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="size-4"/>
                  Voltar
                </Button>
              </Dialog.Close>
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog.Container>
  );
};