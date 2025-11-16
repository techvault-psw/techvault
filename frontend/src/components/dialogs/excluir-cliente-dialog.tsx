/**
 * @fileoverview Dialog de confirmação de exclusão de cliente
 * 
 * Componente de diálogo modal que solicita confirmação do gerente
 * antes de excluir permanentemente um cliente do sistema.
 * 
 * @module components/dialogs/ExcluirClienteDialog
 */

import { ArrowLeftIcon } from "lucide-react";
import { type ReactNode } from "react";
import { TrashIcon } from "../icons/trash-icon";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/root-reducer";
import { useNavigate } from "react-router";
import { deleteClienteServer } from "@/redux/clientes/fetch";
import type { AppDispatch } from "@/redux/store";
import type { Cliente } from "@/redux/clientes/slice";

/**
 * Props do componente ExcluirClienteDialog
 * 
 * @interface ExcluirClienteDialogProps
 * @property {Cliente} cliente - Objeto do cliente a ser excluído
 * @property {ReactNode} children - Elemento que abrirá o dialog quando clicado
 * @property {Function} setIsClientDialogOpen - Função para controlar estado do dialog pai
 */
interface ExcluirClienteDialogProps {
  cliente: Cliente
  children: ReactNode
  setIsClientDialogOpen: (isOpen: boolean) => void
}

/**
 * Componente de diálogo de exclusão de cliente
 * 
 * Exibe um modal de confirmação antes de excluir um cliente do sistema.
 * Se o cliente a ser excluído for o usuário atual, redireciona para /cadastro após exclusão.
 * 
 * @component
 * @param {ExcluirClienteDialogProps} props - Props do componente
 * @param {Cliente} props.cliente - Cliente a ser excluído
 * @param {ReactNode} props.children - Elemento trigger que abre o diálogo
 * @param {Function} props.setIsClientDialogOpen - Controla fechamento do dialog pai
 * @returns {JSX.Element} Diálogo de exclusão de cliente
 * 
 * @example
 * <ExcluirClienteDialog 
 *   cliente={selectedClient}
 *   setIsClientDialogOpen={setDialogOpen}
 * >
 *   <Button variant="destructive">
 *     <TrashIcon />
 *     Excluir
 *   </Button>
 * </ExcluirClienteDialog>
 */
export const ExcluirClienteDialog = ({ cliente, children, setIsClientDialogOpen }: ExcluirClienteDialogProps) => {
  const { clienteAtual } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>();
  
  /**
   * Manipula a confirmação de exclusão do cliente
   * 
   * Deleta o cliente do servidor. Se o cliente excluído for o usuário atual,
   * redireciona para página de cadastro. Fecha o dialog pai após exclusão.
   * 
   * @returns {void}
   */
  const handleDeleteClick = () => {
    dispatch(deleteClienteServer(cliente));
    if (clienteAtual?.id === cliente.id) {
      navigate("/cadastro")
    }
    setIsClientDialogOpen(false)
  }

  return (
    <Dialog.Container>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Excluir Cliente</Dialog.Title>

        <Separator />

        <Dialog.Description>
          Tem certeza de que deseja excluir permanentemente o cliente “{cliente.name}”?
        </Dialog.Description>

        <Dialog.Description>
          Essa ação não poderá ser desfeita e todos os seus dados serão removidos de forma definitiva.
        </Dialog.Description>

        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="outline">
              <ArrowLeftIcon className="size-5" />
              Voltar
            </Button>
          </Dialog.Close>

          <Dialog.Close asChild>
            <Button variant="destructive" onClick={handleDeleteClick}>
              <TrashIcon className="size-5" />
              Excluir
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Container>
  );
};
