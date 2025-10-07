import { ArrowLeftIcon } from "lucide-react";
import { type ReactNode } from "react";
import { TrashIcon } from "../icons/trash-icon";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import type { Endereco } from "@/redux/endereco/slice";

interface ExcluirEnderecoDialogProps {
  children: ReactNode,
  endereco: Endereco,
  handleDeleteClick: () => void
}

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
