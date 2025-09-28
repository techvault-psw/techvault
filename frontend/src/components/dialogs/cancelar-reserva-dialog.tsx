import { X } from "lucide-react";
import { type ReactNode } from "react";
import { ArrowLeftIcon } from "../icons/arrow-left-icon";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import type { Reserva } from "@/redux/reservas/slice";
import type { Cliente } from "@/consts/clientes";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/root-reducer";

interface CancelarReservaDialogProps {
  reserva: Reserva
  cliente?: Cliente
  handleCancelClick: () => void
  children: ReactNode
}

export const CancelarReservaDialog = ({ reserva, cliente, handleCancelClick, children }: CancelarReservaDialogProps) => {
  const { pacotes } = useSelector((state: RootState) => state.pacotesReducer)
  return (
    <Dialog.Container>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Cancelar Reserva</Dialog.Title>

        <Separator />

        {cliente ? (
          <Dialog.Description>
            Tem certeza que deseja cancelar a reserva do "{pacotes[reserva.pacoteIndex].name}" feita por “{cliente.name}”?
          </Dialog.Description>
        ) : (
          <Dialog.Description>
            Tem certeza que deseja cancelar sua a reserva do "{pacotes[reserva.pacoteIndex].name}"?
          </Dialog.Description>
        )}

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
            <Button variant="destructive" onClick={handleCancelClick}>
              <X className="size-4" />
              Cancelar
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Container>
  );
};
