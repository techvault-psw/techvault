import type { DialogProps } from "@radix-ui/react-dialog";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import { selectAllReservas, type Reserva } from "@/redux/reservas/slice";
import { formatCurrency } from "@/lib/format-currency";

interface RelatorioReservasDialogProps extends DialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  startDate: Date;
  endDate: Date;
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

const getResumo: (reservas: Reserva[]) => {
  name: string
  count: string
}[] = (reservas) => {
  const qtdReservas = reservas.length
  const reservasConfirmadas = reservas.filter((reserva) => reserva.status === 'Confirmada')
  const reservasConfirmadasPercent = Math.floor((reservasConfirmadas.length / qtdReservas) * 100)
  const reservasCanceladas = reservas.filter((reserva) => reserva.status === 'Cancelada')
  const reservasCanceladasPercent = Math.floor((reservasCanceladas.length / qtdReservas) * 100)

  return [
    {
      name: "Reservas confirmadas",
      count: `${reservasConfirmadas.length} (${isNaN(reservasConfirmadasPercent) ? 0 : reservasConfirmadasPercent}%)`,
    },
    {
      name: "Reservas canceladas",
      count: `${reservasCanceladas.length} (${isNaN(reservasCanceladasPercent) ? 0 : reservasCanceladasPercent}%)`,
    },
    {
      name: "Reservas totais",
      count: qtdReservas.toString(),
    },
  ]
}

export const RelatorioReservasDialog = ({ open, setOpen, startDate, endDate, ...props }: RelatorioReservasDialogProps) => {
  if (!startDate || !endDate) return null

  const formattedStartDate = format(startDate, "dd/MM/yyyy")
  const formattedEndDate = format(endDate, "dd/MM/yyyy")

  const reservas = useSelector(selectAllReservas)
  const reservasDoPeriodo = reservas.filter((reserva) => {
    const dataReserva = new Date(reserva.dataInicio)
    return dataReserva >= startDate && dataReserva <= endDate
  })
  const reservasFinalizadas = reservasDoPeriodo.filter((reserva) => reserva.status === 'Concluída' || reserva.status === 'Cancelada')
  const resumo = getResumo(reservasFinalizadas)

  return (
    <Dialog.Container open={open} onOpenChange={setOpen} {...props}>
      <Dialog.Content className="max-h-150">
        <Dialog.Title>Relatório de Reservas</Dialog.Title>

        <Dialog.Description className="leading-none text-gray -mt-1">Período: {formattedStartDate} a {formattedEndDate}</Dialog.Description>

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

        {reservasFinalizadas.length !== 0 && (
          <section className="flex flex-col gap-2 overflow-y-hidden">
            <h3 className="font-semibold text-xl text-white mb-1.5">Detalhes</h3>

            <div className="flex flex-col gap-2 scrollbar">
              {reservasFinalizadas.map((reserva) => {
                const formattedReservaStartDate = format(new Date(reserva.dataInicio), "dd/MM/yyyy HH:mm")
                const formattedReservaEndDate = format(new Date(reserva.dataTermino), "dd/MM/yyyy HH:mm")

                return (
                  <div className="w-full p-2 flex justify-between gap-1 bg-white/5 border border-gray/50 rounded-lg backdrop-blur-sm transition-colors duration-200">
                    <div className="text-white text-sm truncate flex flex-col gap-2">
                      <p className="leading-none"><span className="font-semibold">Pacote:</span> {reserva.pacote.name}</p>
                      <p className="leading-none"><span className="font-semibold">Cliente:</span> {reserva.cliente.name}</p>
                      <p className="leading-none"><span className="font-semibold">Data:</span> {formattedReservaStartDate} - {formattedReservaEndDate}</p>
                    </div>
                    <div className="flex flex-col justify-between leading-none text-white text-sm font-semibold">
                      {reserva.status === 'Cancelada' ? (
                        <Badge className="py-0.5" variant="red">Cancelada</Badge>
                      ) : (
                        <Badge className="py-0.5" variant="purple">Concluída</Badge>
                      )}
                      <p className="text-right mt-auto">{formatCurrency(reserva.valor)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </Dialog.Content>
    </Dialog.Container>
  );
};
