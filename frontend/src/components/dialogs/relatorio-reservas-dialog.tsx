import type { DialogProps } from "@radix-ui/react-dialog";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";

interface RelatorioReservasDialogProps extends DialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const resumo = [
  {
    name: "Reservas confirmadas",
    count: "103 (76%)",
  },
  {
    name: "Reservas canceladas",
    count: "25 (24%)",
  },
  {
    name: "Reservas totais",
    count: "128",
  },
]

const reservas = [
  {
    pacote: 'Setup Gamer Duplo',
    cliente: 'João Silva',
    data: '25/08/2025',
    confirmada: true,
    valor: '350,00',
  },
  {
    pacote: 'Setup Gamer Squad',
    cliente: 'João Silva',
    data: '26/08/2025',
    confirmada: false,
    valor: '100,00',
  },
  {
    pacote: 'Setup de Trabalho Profissional',
    cliente: 'João Silva',
    data: '27/08/2025',
    confirmada: true,
    valor: '200,00',
  },
  {
    pacote: 'Setup Gamer Squad',
    cliente: 'João Silva',
    data: '28/08/2025',
    confirmada: false,
    valor: '100,00',
  },
]

export const RelatorioReservasDialog = ({ open, setOpen, ...props }: RelatorioReservasDialogProps) => {
  return (
    <Dialog.Container open={open} onOpenChange={setOpen} {...props}>
      <Dialog.Content className="max-h-150">
        <Dialog.Title>Relatório de Reservas</Dialog.Title>

        <Dialog.Description className="leading-none text-gray -mt-1">Período: 16/08/2025 a 16/09/2025</Dialog.Description>

        <Separator />

        <section className="flex flex-col gap-2">
          <h3 className="font-semibold text-xl text-white mb-1">Resumo</h3>

          {resumo.map(({ name, count }, i) => {
            return (
              <>
                <div className="flex justify-between text-gray leading-none">
                  <p>{name}</p><p>{count}</p>
                </div>
                {i != resumo.length - 1 && <Separator />}
              </>
            )
          })}
        </section>

        <section className="flex flex-col gap-2 overflow-y-hidden">
          <h3 className="font-semibold text-xl text-white mb-1.5">Detalhes</h3>

          <div className="flex flex-col gap-2 scrollbar">
            {reservas.map((reserva) => (
              <div className="w-full p-2 flex justify-between gap-1 bg-white/5 border border-gray-2/50 rounded-lg backdrop-blur-sm transition-colors duration-200">
                <div className="text-white text-sm truncate">
                  <p><span className="font-semibold">Pacote:</span> {reserva.pacote}</p>
                  <p><span className="font-semibold">Cliente:</span> {reserva.cliente}</p>
                  <p><span className="font-semibold">Data:</span> {reserva.data}</p>
                </div>
                <div className="flex flex-col justify-between leading-none text-white text-sm font-semibold">
                  {reserva.confirmada ? (
                    <p className="bg-green-600 rounded-xl py-1 px-3">Confirmada</p>
                  ) : (
                    <p className="bg-red-500 rounded-xl py-1 px-3">Cancelada</p>
                  )}
                  <p className="text-right">R$ {reserva.valor}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Dialog.Content>
    </Dialog.Container>
  );
};
