import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { ArrowRightIcon } from '@/components/icons/arrow-right-icon';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
}

interface DetalhesClienteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  client: Client | null;
}

export const DetalhesClienteDialog = ({ open, setOpen, client }: DetalhesClienteDialogProps) => {
  if (!client) {
    return null;
  }

  return (
    <Dialog.Container open={open} onOpenChange={setOpen}>
      <Dialog.Content className="p-4">
        <Dialog.Title className="text-xxl font-bold">Dados do Cliente</Dialog.Title>

        <Separator />
        
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-400 mb-1">Nome</label>
            <div className="bg-slate-800/50 border border-gray-700 rounded-md px-3 py-2 text-white">
              {client.name}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-400 mb-1">E-mail</label>
            <div className="bg-slate-800/50 border border-gray-700 rounded-md px-3 py-2 text-white">
              {client.email}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-400 mb-1">Telefone</label>
            <div className="bg-slate-800/50 border border-gray-700 rounded-md px-3 py-2 text-white">
              {client.phone}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-400 mb-1">Data de Cadastro</label>
            <div className="bg-slate-800/50 border border-gray-700 rounded-md px-3 py-2 text-white">
              {client.registrationDate}
            </div>
          </div>
        </div>

        <div className="mt-1 flex flex-col gap-2">
          <Button variant="outline" className="w-full flex justify-between items-center p-4">
            <span>Ver Reservas</span>
            <ArrowRightIcon />
          </Button>
          <Button variant="outline" className="w-full flex justify-between items-center p-4">
            <span>Ver Endereços</span>
            <ArrowRightIcon />
          </Button>
        </div>
        
      </Dialog.Content>
    </Dialog.Container>
  );
};