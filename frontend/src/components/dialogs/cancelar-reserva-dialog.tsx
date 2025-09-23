import { X } from "lucide-react";
import { type ReactNode } from "react";
import { ArrowLeftIcon } from "../icons/arrow-left-icon";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import type { Reserva } from "@/consts/reservas";
import { pacotes } from "@/consts/pacotes";
import { Link } from "react-router";

interface CancelarReservaDialog {
  children: ReactNode
  reserva: Reserva
}

export const CancelarReservaDialog = ({ reserva, children }: CancelarReservaDialog) => {
  return (
    <Dialog.Container>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Cancelar Reserva</Dialog.Title>

        <Separator />

        <Dialog.Description>
          Tem certeza que deseja cancelar a sua reserva do “{pacotes[reserva.pacoteIndex].name}”?
        </Dialog.Description>

        <Dialog.Description>
          Essa ação não pode ser desfeita.
        </Dialog.Description>

        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="outline">
              <ArrowLeftIcon className="size-5" />
              Voltar
            </Button>
          </Dialog.Close>

          <Dialog.Close asChild>
            <Button variant="destructive" asChild>
              <Link to="/minhas-reservas">
                <X className="size-5" />
                Cancelar
              </Link>
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Container>
  );
};
