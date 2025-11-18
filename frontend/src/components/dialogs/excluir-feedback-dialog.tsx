/**
 * @fileoverview Diálogo de confirmação para exclusão de feedback
 * 
 * Exibe um aviso de confirmação antes de excluir permanentemente um feedback.
 * O texto de aviso varia dependendo se o usuário é gerente ou cliente comum.
 * 
 * @module components/dialogs/ExcluirFeedbackDialog
 */

import useCargo from "@/hooks/useCargo";
import { type Feedback } from "@/redux/feedbacks/slice";
import { ArrowLeftIcon } from "lucide-react";
import { type ReactNode } from "react";
import { useDispatch } from "react-redux";
import { TrashIcon } from "../icons/trash-icon";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { deleteFeedbackServer } from "@/redux/feedbacks/fetch";
import { type AppDispatch } from "@/redux/store";

/**
 * Props do diálogo de exclusão de feedback
 * 
 * @interface ExcluirFeedbackDialogProps
 * @property {Feedback} feedback - Objeto do feedback a ser excluído
 * @property {ReactNode} children - Elemento que dispara a abertura do diálogo
 */
interface ExcluirFeedbackDialogProps {
  feedback: Feedback
  children: ReactNode
}

/**
 * Diálogo de confirmação para exclusão de feedback
 * 
 * Exibe mensagens contextualizadas:
 * - Para gerentes: informa que está excluindo o feedback de outro usuário sobre um pacote
 * - Para clientes: informa que está excluindo seu próprio feedback
 * - Em ambos os casos, alerta que a ação é irreversível
 * 
 * @component
 * @param {ExcluirFeedbackDialogProps} props - Props do diálogo
 * @param {Feedback} props.feedback - Dados do feedback a excluir
 * @param {ReactNode} props.children - Botão ou elemento que abre o diálogo
 * @returns {JSX.Element} Diálogo de confirmação de exclusão
 * 
 * @example
 * // Uso do diálogo
 * <ExcluirFeedbackDialog feedback={feedback}>
 *   <Button variant="destructive" size="icon">Excluir</Button>
 * </ExcluirFeedbackDialog>
 */
export const ExcluirFeedbackDialog = ({ feedback, children }: ExcluirFeedbackDialogProps) => {
  const { isGerente } = useCargo()

  const dispatch = useDispatch<AppDispatch>()

  const handleDeleteClick = () => {
    dispatch(deleteFeedbackServer(feedback))
  }

  return (
    <Dialog.Container>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Excluir Feedback</Dialog.Title>

        <Separator />

        {isGerente() ? (
          <Dialog.Description>
            Tem certeza de que deseja excluir permanentemente o feedback do pacote “{feedback.pacote.name}” feito por "{feedback.cliente.name}"?
          </Dialog.Description>
        ) : (
          <Dialog.Description>
            Tem certeza de que deseja excluir permanentemente seu feedback do pacote “{feedback.pacote.name}”?
          </Dialog.Description>
        )}


        <Dialog.Description>
          Essa ação não poderá ser desfeita.
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
