/**
 * @fileoverview Dialog de confirmação de cancelamento de reserva
 * 
 * Componente de dialog para confirmar a ação de cancelamento de uma reserva,
 * com mensagem adaptada se é o próprio cliente ou um administrador cancelando.
 * 
 * @module components/dialogs/CancelarReservaDialog
 */

import { X } from "lucide-react";
import { type ReactNode } from "react";
import { ArrowLeftIcon } from "../icons/arrow-left-icon";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import type { Reserva } from "@/redux/reservas/slice";
import type { Cliente } from "@/redux/clientes/slice";

/**
 * Props do componente CancelarReservaDialog
 * 
 * @interface CancelarReservaDialogProps
 * @property {Reserva} reserva - Reserva a ser cancelada
 * @property {Cliente} [cliente] - Cliente da reserva (para contexto administrativo)
 * @property {Function} handleCancelClick - Callback executado ao confirmar cancelamento
 * @property {ReactNode} children - Elemento trigger que abre o dialog
 */
interface CancelarReservaDialogProps {
  reserva: Reserva
  cliente?: Cliente
  handleCancelClick: () => void
  children: ReactNode
}

/**
 * Componente Dialog de cancelamento de reserva
 * 
 * Exibe confirmação antes de cancelar uma reserva:
 * - Mensagem adaptada para contexto (cliente próprio ou administrador)
 * - Avisos sobre irreversibilidade da ação
 * - Botões de voltar e confirmar cancelamento
 * 
 * @component
 * @param {CancelarReservaDialogProps} props - Props do componente
 * @param {Reserva} props.reserva - Reserva a cancelar
 * @param {Cliente} [props.cliente] - Cliente (opcional, para admin)
 * @param {Function} props.handleCancelClick - Handler de cancelamento
 * @param {ReactNode} props.children - Trigger
 * @returns {JSX.Element} Dialog de confirmação de cancelamento
 * 
 * @example
 * <CancelarReservaDialog 
 *   reserva={reserva}
 *   handleCancelClick={() => dispatch(cancelReserva())}
 * >
 *   <Button variant="destructive">Cancelar Reserva</Button>
 * </CancelarReservaDialog>
 */
export const CancelarReservaDialog = ({ reserva, cliente, handleCancelClick, children }: CancelarReservaDialogProps) => {
  return (
    <Dialog.Container>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Cancelar Reserva</Dialog.Title>

        <Separator />

        {cliente ? (
          <Dialog.Description>
            Tem certeza que deseja cancelar a reserva do "{reserva.pacote.name}" feita por “{cliente.name}”?
          </Dialog.Description>
        ) : (
          <Dialog.Description>
            Tem certeza que deseja cancelar a sua reserva do "{reserva.pacote.name}"?
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
