import { Button } from "@/components/ui/button"; 
import { Dialog } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator"; 
import { ArrowLeft, Pencil, X } from "lucide-react";

interface DetalhesReservaDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  reserva: Reserva | null;
  clienteNome: string;
}

interface Reserva { 
  id: number; 
  clienteId: number; 
  titulo: string; 
  endereco: string; 
  dataInicio: string; 
  dataFim: string; 
  status: "ativa" | "concluida" | "cancelada";
  tipo: string;
  precoTotal: string;
}


const InfoField = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-400 mb-1">{label}</label>
    <div className="bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-white">
      {value}
    </div>
  </div>
);

export const DetalhesReservaDialog = ({ open, setOpen, reserva, clienteNome }: DetalhesReservaDialogProps) => {
  if (!reserva) {
    return null;
  }

  return (
    <Dialog.Container open={open} onOpenChange={setOpen}>
      <Dialog.Content className="p-0 bg-[#0f172a] border-slate-800 text-white [&>button]:hidden flex flex-col max-h-[90vh]">
        
        <div className="p-5 px-5 pb-0 flex-shrink-0">
          <Dialog.Title className="text-xl font-bold">Informações da Reserva</Dialog.Title>
          <Separator className="bg-slate-700 mt-3" />
        </div>
        
        <div className="flex flex-col gap-3 px-4 flex-1 overflow-y-auto 
                       [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid grid-cols-2 gap-3">
            <InfoField label="Tipo" value={reserva.tipo} />
            <InfoField label="Preço Total Pago" value={reserva.precoTotal} />
          </div>

          <InfoField label="Data de Início" value={reserva.dataInicio} />
          <InfoField label="Data de Término" value={reserva.dataFim} />
          <InfoField label="Pacote" value={reserva.titulo} />
          <InfoField label="Endereço" value={reserva.endereco} />
          <InfoField label="Cliente" value={clienteNome} />
        </div>

        <div className="p-5 flex flex-col gap-2 border-t border-slate-800 bg-black/20 flex-shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="destructive">
              <X size={16} className="mr-2"/> Cancelar
            </Button>
            <Button variant="outline">
              <Pencil size={15} className="mr-2"/> Editar
            </Button>
          </div>
          <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
            <ArrowLeft size={16} className="mr-2"/> Voltar
          </Button>
        </div>
        
      </Dialog.Content>
    </Dialog.Container>
  );
};