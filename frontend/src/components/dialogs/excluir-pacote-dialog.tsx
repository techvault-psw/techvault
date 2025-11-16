/**
 * @fileoverview Diálogo de confirmação para exclusão de pacote
 * 
 * Exibe um aviso de confirmação antes de excluir permanentemente um pacote.
 * Informa ao usuário que a ação é irreversível e que todas as reservas serão canceladas.
 * 
 * @module components/dialogs/ExcluirPacoteDialog
 */

import { ArrowLeftIcon } from "lucide-react";
import { type ReactNode } from "react";
import { TrashIcon } from "../icons/trash-icon";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import type { Pacote } from "@/redux/pacotes/slice";

/**
 * Props do diálogo de exclusão de pacote
 * 
 * @interface ExcluirPacoteDialogProps
 * @property {Pacote} pacote - Objeto do pacote a ser excluído
 * @property {ReactNode} children - Elemento que dispara a abertura do diálogo
 * @property {Function} handleDeleteClick - Callback executado ao confirmar exclusão
 */
interface ExcluirPacoteDialogProps {
  pacote: Pacote
  children: ReactNode
  handleDeleteClick: () => void
}

/**
 * Diálogo de confirmação para exclusão de pacote
 * 
 * Exibe mensagens de aviso informando:
 * - O nome do pacote que será excluído
 * - Que a ação é irreversível
 * - Que todas as reservas serão canceladas
 * 
 * Oferece botões para cancelar ou confirmar exclusão.
 * 
 * @component
 * @param {ExcluirPacoteDialogProps} props - Props do diálogo
 * @param {Pacote} props.pacote - Dados do pacote a excluir
 * @param {ReactNode} props.children - Botão ou elemento que abre o diálogo
 * @param {Function} props.handleDeleteClick - Função chamada ao confirmar exclusão
 * @returns {JSX.Element} Diálogo de confirmação de exclusão
 * 
 * @example
 * // Uso do diálogo
 * <ExcluirPacoteDialog pacote={pacote} handleDeleteClick={handleDelete}>
 *   <Button variant="destructive">Excluir</Button>
 * </ExcluirPacoteDialog>
 */
export const ExcluirPacoteDialog = ({ pacote, children, handleDeleteClick }: ExcluirPacoteDialogProps) => {
  return (
    <Dialog.Container>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Excluir Pacote</Dialog.Title>

        <Separator />

        <Dialog.Description>
          Tem certeza de que deseja excluir permanentemente o pacote “{pacote.name}”?
        </Dialog.Description>

        <Dialog.Description>
          Essa ação não poderá ser desfeita e todos as reservas dele serão canceladas de forma definitiva.
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