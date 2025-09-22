import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Reserva } from "@/consts/reservas";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowLeft, Pencil, X } from "lucide-react";
import type { ReactNode } from "react";
import { FormItem } from "../ui/form";
import { Input, Label } from "../ui/input";
import { Card } from "../ui/card";
import { pacotes } from "@/consts/pacotes";

interface DetalhesReservaDialogProps {
  reserva: Reserva
  tipo?: 'Entrega' | 'Coleta'
  children: ReactNode
}

const InfoField = ({ label, value }: { label: string, value: string }) => (
  <FormItem>
    <Label>{label}</Label>
    <Input
      type="text"
      value={value}
    />
  </FormItem>
);

export const DetalhesReservaDialog = ({ reserva, tipo, children }: DetalhesReservaDialogProps) => {
  const formattedStartDate = format(reserva.dataInicio, "dd/MM/yyyy hh:MM")
  const formattedEndDate = format(reserva.dataTermino, "dd/MM/yyyy hh:MM")

  return (
    <Dialog.Container>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title className="text-xl font-bold">Informações da Reserva</Dialog.Title>
        
        <Separator />
        
        <div className="flex gap-3 justify-between">
          <div className={cn("w-full grid gap-3", tipo ? "grid-cols-2" : "grid-cols-1")}>
            {tipo && (
              <InfoField label="Tipo" value={tipo} />
            )}
            <InfoField label="Preço Total Pago" value={formatCurrency(reserva.valor)} />
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

        <InfoField label="Data de Início" value={formattedStartDate} />
        <InfoField label="Data de Término" value={formattedEndDate} />

        <Dialog.Footer className="flex-col">
          <div className="w-full flex gap-3 items-center">
            <Button variant="destructive">
              <X className="size-4"/>
              Cancelar
            </Button>

            <Button variant="outline">
              <Pencil className="size-4"/>
              Editar
            </Button>
          </div>

          <Dialog.Close asChild>
            <Button variant="outline" className="w-full">
              <ArrowLeft className="size-4"/>
              Voltar
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Container>
  );
};