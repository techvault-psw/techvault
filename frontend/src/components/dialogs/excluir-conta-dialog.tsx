import { ArrowLeftIcon } from "lucide-react";
import { type ReactNode } from "react";
import { TrashIcon } from "../icons/trash-icon";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";

interface ExcluirContaDialogProps {
  children: ReactNode
  handleDeleteClick: () => void
}

export const ExcluirContaDialog = ({ children, handleDeleteClick }: ExcluirContaDialogProps) => {
  return (
    <Dialog.Container>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Excluir Conta</Dialog.Title>

        <Separator />

        <Dialog.Description>
          Tem certeza de que deseja excluir permanentemente a sua conta?
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
