import type { Feedback } from "@/consts/feedbacks";
import { ArrowLeftIcon } from "lucide-react";
import { type ReactNode } from "react";
import { TrashIcon } from "../icons/trash-icon";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { pacotes } from "@/consts/pacotes";

interface ExcluirFeedbackDialogProps {
  feedback: Feedback
  children: ReactNode
}

export const ExcluirFeedbackDialog = ({ feedback, children }: ExcluirFeedbackDialogProps) => {
  return (
    <Dialog.Container>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Excluir Feedback</Dialog.Title>

        <Separator />

        {/* TODO: Se for gerente */}
        {/* <Dialog.Description>
          Tem certeza de que deseja excluir permanentemente o feedback do pacote “{pacotes[feedback.pacoteIndex].name}” feito por "{feedback.cliente}"?
        </Dialog.Description> */}

        <Dialog.Description>
          Tem certeza de que deseja excluir permanentemente seu feedback do pacote “{pacotes[feedback.pacoteIndex].name}”?
        </Dialog.Description>

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
            <Button variant="destructive">
              <TrashIcon className="size-5" />
              Excluir
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Container>
  );
};
