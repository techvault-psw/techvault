import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom" 
import { ArrowLeft } from "lucide-react"
import { FilterIcon } from "@/components/icons/filter-icon"
import { SlidersIcon } from "@/components/icons/sliders-icon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DetalhesReservaDialog } from "@/components/dialogs/detalhes-reserva-dialog"

export interface Cliente { id: number; nome: string }
export interface Reserva { 
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

const todosOsClientes: Cliente[] = [{ id: 1, nome: "João Silva" }, { id: 2, nome: "Maria Oliveira" }];
const todasAsReservas: Reserva[] = [
  { id: 101, clienteId: 1, titulo: "Setup Gamer Duplo", endereco: "Rua General Canabarro, 485", dataInicio: "02/09/2025 18:10", dataFim: "03/09/2025 21:30", status: "ativa", tipo: "Entrega", precoTotal: "R$ 700,00"},
  { id: 105, clienteId: 1, titulo: "Setup Gamer Duplo", endereco: "Rua General Canabarro, 485", dataInicio: "03/10/2025 18:10", dataFim: "04/10/2025 21:30", status: "ativa", tipo: "Entrega", precoTotal: "R$ 700,00" },
  { id: 102, clienteId: 1, titulo: "Setup de Trabalho Profissional", endereco: "Rua General Canabarro, 485", dataInicio: "25/08/2025 10:00", dataFim: "25/08/2025 21:30", status: "concluida", tipo: "Entrega", precoTotal: "R$ 700,00" },
  { id: 106, clienteId: 1, titulo: "Setup de Trabalho Profissional", endereco: "Rua General Canabarro, 485", dataInicio: "26/08/2025 10:00", dataFim: "26/08/2025 21:30", status: "concluida", tipo: "Entrega", precoTotal: "R$ 700,00"},
  { id: 107, clienteId: 1, titulo: "Setup Gamer Duplo", endereco: "Rua General Canabarro, 485", dataInicio: "15/08/2025 10:00", dataFim: "15/08/2025 21:30", status: "concluida", tipo: "Entrega", precoTotal: "R$ 700,00"},
  { id: 104, clienteId: 1, titulo: "Setup Gamer Duplo", endereco: "Rua General Canabarro, 485", dataInicio: "01/07/2025 18:10", dataFim: "02/07/2025 21:30", status: "cancelada", tipo: "Entrega", precoTotal: "R$ 700,00"},
  { id: 201, clienteId: 2, titulo: "Notebook Básico", endereco: "Rua da Alfândega, 100", dataInicio: "05/09/2025 14:00", dataFim: "05/09/2025 16:00", status: "ativa", tipo: "Entrega", precoTotal: "R$ 700,00"},
];

const ReservaSection = ({ titulo, reservas, onReservaClick }: { titulo: string; reservas: Reserva[]; onReservaClick: (reserva: Reserva) => void }) => {
  if (reservas.length === 0) return null;
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex gap-2 items-center w-full">
        <span className="font-medium text-white text-xl flex-shrink-0">{titulo}</span>
        <div className="flex-1 bg-white/50 h-px" />
      </div>
      <section className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reservas.map((reserva) => (
          <div key={reserva.id} onClick={() => onReservaClick(reserva)} className="cursor-pointer h-full">
            <Card.Container className="bg-white/5 hover:bg-white/10 border border-slate-500/50 backdrop-blur-sm transition-colors duration-200 h-full">
              <Card.TextContainer className="text-white truncate">
                <div className="flex items-center justify-between gap-2 font-semibold">
                  <Card.Title className="truncate">{reserva.titulo}</Card.Title>
                  {reserva.status === "cancelada" && <span className="flex-shrink-0 leading-none text-xs bg-red-800 py-1 px-3 rounded-lg">Cancelada</span>}
                </div>
                <Card.Description className="text-gray-300 font-light truncate"><span className="font-medium text-gray-200">Endereço:</span> {reserva.endereco}</Card.Description>
                <Card.Description className="text-gray-300 font-light truncate"><span className="font-medium text-gray-200">Data:</span> {reserva.dataInicio} - {reserva.dataFim}</Card.Description>
              </Card.TextContainer>
            </Card.Container>
          </div>
        ))}
      </section>
    </div>
  );
};

export const ReservasClientePage = () => {
  const navigate = useNavigate();
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);

const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setReservaSelecionada(null);
    }
  };

  const clienteId = 1;
  const clienteAtual = todosOsClientes.find((c) => c.id === clienteId);
  const reservasDoCliente = todasAsReservas.filter((r) => r.clienteId === clienteId);
  const sortedReservas = useMemo(() => {
    const parseDate = (dateString: string) => {
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes).getTime();
    };
    return [...reservasDoCliente].sort((a, b) => {
        const dateA = parseDate(a.dataInicio);
        const dateB = parseDate(b.dataInicio);
        return dateB - dateA;
    });
  }, [reservasDoCliente]);

  const reservasAtuais = sortedReservas.filter((r) => r.status === "ativa");
  const reservasConcluidas = sortedReservas.filter((r) => r.status === "concluida");
  const reservasCanceladas = sortedReservas.filter((r) => r.status === "cancelada");

  return (
    <>
      <div className="text-white h-dvh flex flex-col items-center bg-[url('/background.png')] bg-cover bg-center bg-fixed">
        <div className="w-full max-w-7xl h-full p-4 flex flex-col items-center gap-4 md:items-start">
          <div className="flex-shrink-0 w-full flex flex-col items-center md:items-start gap-4">
            <h2 className="text-3xl font-bold text-white text-center md:text-4xl">Reservas de {clienteAtual?.nome}</h2>
            <div className="flex items-center gap-4">
              <Button variant="secondary" className="w-40 md:w-52 py-1 flex gap-1 items-center justify-center font-medium"><FilterIcon className="size-4" /> Filtros</Button>
              <Button variant="secondary" className="w-40 md:w-52 py-1 flex gap-1 items-center justify-center font-medium"><SlidersIcon className="size-4" /> Ordenar por</Button>
            </div>
          </div>
          <section className="w-full flex-1 flex flex-col gap-6 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-track]:bg-slate-800/50 [&::-webkit-scrollbar-thumb]:rounded-full">
            <ReservaSection titulo="Atuais" reservas={reservasAtuais} onReservaClick={setReservaSelecionada} />
            <ReservaSection titulo="Concluídas" reservas={reservasConcluidas} onReservaClick={setReservaSelecionada} />
            <ReservaSection titulo="Canceladas" reservas={reservasCanceladas} onReservaClick={setReservaSelecionada} />
          </section>
          <div className="flex-shrink-0 w-full flex justify-center md:justify-start">
            <Button variant="outline" onClick={() => navigate(-1)} className="w-60 mt-2 bg-gray-200/10 hover:bg-gray-200/20 border-2 border-white"><ArrowLeft size={16} className="mr-2" /> Voltar</Button>
          </div>
        </div>
      </div>
      
      <DetalhesReservaDialog
        open={!!reservaSelecionada}
        setOpen={handleOpenChange}
        reserva={reservaSelecionada}
        clienteNome={clienteAtual?.nome || ''}
      />
    </>
  );
};