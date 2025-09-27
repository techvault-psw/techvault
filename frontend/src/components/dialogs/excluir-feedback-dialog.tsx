import useCargo from "@/hooks/useCargo";
import { deleteFeedback, type Feedback } from "@/redux/feedbacks/slice";
import { ArrowLeftIcon } from "lucide-react";
import { type ReactNode } from "react";
import { useDispatch } from "react-redux";
import { TrashIcon } from "../icons/trash-icon";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";

interface ExcluirFeedbackDialogProps {
  feedback: Feedback
  children: ReactNode
}

export const ExcluirFeedbackDialog = ({ feedback, children }: ExcluirFeedbackDialogProps) => {
  const { isGerente } = useCargo()

  const dispatch = useDispatch()

  const handleDeleteClick = () => {
    dispatch(deleteFeedback(feedback.id))
  }

  return (
    <Dialog.Container>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Excluir Feedback</Dialog.Title>

        <Separator />

        {isGerente() ? (
          <Dialog.Description>
            Tem certeza de que deseja excluir permanentemente o feedback do pacote “{feedback.package.name}” feito por "{feedback.customer.name}"?
          </Dialog.Description>
        ) : (
          <Dialog.Description>
            Tem certeza de que deseja excluir permanentemente seu feedback do pacote “{feedback.package.name}”?
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
