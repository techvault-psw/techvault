import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Reserva } from "@/redux/reservas/slice";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import { ArrowLeft, Pen, X } from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input, Label } from "../ui/input";
import { Card } from "../ui/card";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTimePicker } from "../ui/datetime-picker";
import { CancelarReservaDialog } from "./cancelar-reserva-dialog";
import { clientes } from "@/consts/clientes";
import useCargo from "@/hooks/useCargo";
import { ConfirmarOperacaoDialog } from "./confirmar-operacao-dialog";
import { DadosClienteDialog } from "./dados-cliente-dialog";
import { DadosEnderecoDialog } from "./dados-endereco-dialog";
import { DadosPacoteDialog } from "./dados-pacote-dialog";
import { useDispatch } from "react-redux";
import { cancelReservaServer, updateReservaServer } from "@/redux/reservas/fetch";
import { useLocation } from "react-router";
import { type AppDispatch } from "@/redux/store";

interface DetalhesReservaDialogProps {
  reserva: Reserva
  tipo?: 'Entrega' | 'Coleta'
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  openClientDialog?: boolean
  onOperacaoSucesso?: (reserva: Reserva, tipo: "Entrega" | "Coleta") => void
}

const formSchema = z
    .object({
        dataHoraInicial: z.date({message: "Por favor, preencha a data inicial"}),
        dataHoraFinal: z.date({message: "Por favor, preencha a data final"}),
        dataEntrega: z.date().optional(),
        dataColeta: z.date().optional(),
        codigoEntrega: z.string()
            .min(1, { message: "Insira um código válido" })
            .length(7, { message: "O código deve ter exatamente 7 caracteres" }),
        codigoColeta: z.string()
            .min(1, { message: "Insira um código válido" })
            .length(7, { message: "O código deve ter exatamente 7 caracteres" })
    })
    .refine((data) => data.dataHoraInicial <= data.dataHoraFinal, {
        message: "Data final não pode ser antes que a data inicial",
        path: ["dataHoraFinal"],
    });

type FormData = z.infer<typeof formSchema>;

export const DetalhesReservaDialog = ({ reserva, tipo, children, open: controlledOpen, onOpenChange, openClientDialog, onOperacaoSucesso }: DetalhesReservaDialogProps) => {
  const [isEditting, setIsEditting] = useState(false)
  const [internalOpen, setInternalOpen] = useState(false)
  const [clientDialogOpen, setClientDialogOpen] = useState(false)
  const location = useLocation()

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  useEffect(() => {
    if (openClientDialog && isOpen) {
      setClientDialogOpen(true);
    } else if (!openClientDialog) {
      setClientDialogOpen(false);
    }
  }, [openClientDialog, isOpen]);

  const { isGerente, isSuporte } = useCargo()
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataHoraInicial: new Date(reserva.dataInicio),
      dataHoraFinal: new Date(reserva.dataTermino),
      dataEntrega: reserva.dataEntrega ? new Date(reserva.dataEntrega) : undefined,
      dataColeta: reserva.dataColeta ? new Date(reserva.dataColeta) : undefined,
      codigoColeta: reserva.codigoColeta,
      codigoEntrega: reserva.codigoEntrega,
    },
    mode: "onChange"
  })
  
  const dispatch = useDispatch<AppDispatch>()

  const onSubmit = (values: FormData) => {
    setIsEditting(false)
    dispatch(updateReservaServer({
      ...reserva,
      dataInicio: values.dataHoraInicial.toISOString(),
      dataTermino: values.dataHoraFinal.toISOString(),
      dataEntrega: values.dataEntrega?.toISOString(),
      dataColeta: values.dataColeta?.toISOString(),
      codigoColeta: values.codigoColeta,
      codigoEntrega: values.codigoEntrega,
    }))
  }


  const handleOpenChange = (open: boolean) => {
    if (!isControlled) {
      setInternalOpen(open);
    }
    onOpenChange?.(open);
  };

  const cancelarReserva = () => {
    handleOpenChange(false)
    dispatch(cancelReservaServer(reserva))
  }

  const isClientePage = location.pathname.startsWith('/reservas-cliente')

  return (
    <Dialog.Container open={isOpen} onOpenChange={handleOpenChange}>
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

        <DadosPacoteDialog pacote={reserva.pacote}>
          <FormItem>
            <Label>Pacote</Label>
            <Card.Container>
              <Card.Title>
                {reserva.pacote.name}
              </Card.Title>
            </Card.Container>
          </FormItem>
        </DadosPacoteDialog>

        <DadosEnderecoDialog endereco={reserva.endereco}>
          <FormItem>
            <Label>Endereço</Label>
            <Card.Container>
              <Card.Title>
                {reserva.endereco.name}
              </Card.Title>
            </Card.Container>
          </FormItem>
        </DadosEnderecoDialog>

        {!isClientePage && (
          <DadosClienteDialog 
            cliente={reserva.cliente} 
            fromReservaId={reserva.id}
            open={clientDialogOpen}
            onOpenChange={setClientDialogOpen}
          >
            <FormItem>
              <Label>Cliente</Label>
              <Card.Container>
                <Card.Title>
                  {reserva.cliente.name}
                </Card.Title>
              </Card.Container>
            </FormItem>
          </DadosClienteDialog>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex items-center gap-2 w-full">
              <FormField
                control={form.control}
                name="dataHoraInicial"
                render={({ field }) => (
                  <FormItem className="flex-1">
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
                  <FormItem className="flex-1">
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
            </div>

            <div className="flex items-center gap-2 w-full">
              <FormField
                control={form.control}
                name="dataEntrega"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Data e Hora de Entrega</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        minuteStep={1}
                        disabled={!isEditting}
                        placeholder="Não houve entrega"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataColeta"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Data e Hora de Coleta</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        minuteStep={1}
                        disabled={!isEditting}
                        placeholder="Não houve coleta"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isGerente() && (
              <div className="flex items-center gap-2 w-full">
                <FormField
                  control={form.control}
                  name="codigoEntrega"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Código de Entrega</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="A1B2C3D"
                          disabled={!isEditting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="codigoColeta"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Código de Coleta</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="E4F5G6H"
                          disabled={!isEditting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Dialog.Footer className="block space-y-3">
              {(isSuporte() || isGerente()) && tipo && (
                <ConfirmarOperacaoDialog reserva={reserva} tipo={tipo} onSuccess={onOperacaoSucesso}>
                  <Button className="w-full h-[2.625rem]">
                    Confirmar {tipo}
                  </Button>
                </ConfirmarOperacaoDialog>
              )}

              {isEditting ? (
                <Button type="submit" className="h-[2.625rem] w-full">
                  Salvar alterações
                </Button>
              ) : isGerente() && (
                <div className="w-full flex gap-2 items-center">
                  {reserva.status === "Confirmada" && (
                    <CancelarReservaDialog
                      cliente={clientes[0]}
                      handleCancelClick={cancelarReserva}
                      reserva={reserva}
                    >
                      <Button variant="destructive">
                        <X className="size-4"/>
                        Cancelar
                      </Button>
                    </CancelarReservaDialog>
                  )}

                  <Button variant="outline" onClick={() => setIsEditting(true)}>
                    <Pen className="size-4" />
                    Editar
                  </Button>
                </div>
              )}

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