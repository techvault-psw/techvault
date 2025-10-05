import { ArrowLeftIcon } from "lucide-react";
import { type ReactNode } from "react";
import { TrashIcon } from "../icons/trash-icon";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import type { Pacote } from "@/redux/pacotes/slice";
import { useDispatch } from "react-redux";
import { deletePacoteServer } from "@/redux/pacotes/fetch";
import type { AppDispatch } from "@/redux/store";

interface ExcluirPacoteDialogProps {
  pacote: Pacote;
  children: ReactNode;
}

export const ExcluirPacoteDialog = ({ pacote, children }: ExcluirPacoteDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = () => {
    dispatch(deletePacoteServer(pacote));
  };

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
            <Button variant="destructive" onClick={handleDelete}>
              <TrashIcon className="size-5" />
              Excluir
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Container>
  );
};