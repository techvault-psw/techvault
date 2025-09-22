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
        <Dialog.Title>Relatório de Reservas</Dialog.Title>

        <Separator />

        <Dialog.Description>
          Tem certeza que deseja cancelar a sua reserva do “{pacotes[reserva.pacoteIndex].name}”?
        </Dialog.Description>

        <Dialog.Description>
          Essa ação não pode ser desfeita.
        </Dialog.Description>

        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="outline" className="md:order-1 xl:col-start-2">
              <ArrowLeftIcon className="size-5" />
              <span className="text-white text-lg font-medium leading-none">Voltar</span>
            </Button>
          </Dialog.Close>

          <Dialog.Close asChild>
            <Button variant="destructive" asChild>
              <Link to="/minhas-reservas">
                <X className="size-5 text-red" />
                <span className="text-red text-lg font-medium leading-none">Cancelar</span>
              </Link>
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Container>
  );
};
