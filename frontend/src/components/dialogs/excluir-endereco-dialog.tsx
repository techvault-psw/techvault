/**
 * @fileoverview Dialog de confirmação para exclusão de endereço
 * 
 * Componente modal que exibe uma confirmação antes de excluir permanentemente
 * um endereço do cliente. Permite que o usuário cancele ou confirme a exclusão.
 * 
 * @module components/dialogs/ExcluirEnderecoDialog
 */

import { ArrowLeftIcon } from "lucide-react";
import { type ReactNode } from "react";
import { TrashIcon } from "../icons/trash-icon";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import type { Endereco } from "@/redux/endereco/slice";

/**
 * Props do componente ExcluirEnderecoDialog
 * 
 * @interface ExcluirEnderecoDialogProps
 * @property {ReactNode} children - Elemento que dispara a abertura do dialog (trigger)
 * @property {Endereco} endereco - Objeto do endereço a ser excluído
 * @property {Function} handleDeleteClick - Callback executado ao confirmar a exclusão
 */
interface ExcluirEnderecoDialogProps {
  children: ReactNode,
  endereco: Endereco,
  handleDeleteClick: () => void
}

/**
 * Componente de dialog para exclusão de endereço
 * 
 * Exibe um modal de confirmação com o nome do endereço a ser deletado.
 * Oferece dois botões: um para cancelar e outro para confirmar a exclusão.
 * 
 * @component
 * @param {ExcluirEnderecoDialogProps} props - Props do componente
 * @param {ReactNode} props.children - Elemento trigger do dialog
 * @param {Endereco} props.endereco - Endereço a ser excluído
 * @param {Function} props.handleDeleteClick - Função chamada ao confirmar exclusão
 * @returns {JSX.Element} Dialog com confirmação de exclusão
 * 
 * @example
 * <ExcluirEnderecoDialog 
 *   endereco={endereco} 
 *   handleDeleteClick={handleDelete}
 * >
 *   <Button variant="destructive">
 *     <TrashIcon /> Excluir
 *   </Button>
 * </ExcluirEnderecoDialog>
 */
export const ExcluirEnderecoDialog = ({ children, endereco, handleDeleteClick }: ExcluirEnderecoDialogProps) => {
  return (
    <Dialog.Container>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Excluir Endereço</Dialog.Title>

        <Separator />

        <Dialog.Description>
          Tem certeza de que deseja excluir permanentemente o endereço "{endereco.name}"?
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
