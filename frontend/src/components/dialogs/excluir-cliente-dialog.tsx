import { clientes, type Cliente } from "@/consts/clientes";
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


interface ExcluirClienteDialogProps {
  cliente: Cliente
  children: ReactNode
  setIsClientDialogOpen: (isOpen: boolean) => void
}
export const ExcluirClienteDialog = ({ cliente, children, setIsClientDialogOpen }: ExcluirClienteDialogProps) => {
  const { clienteAtual } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>();
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
