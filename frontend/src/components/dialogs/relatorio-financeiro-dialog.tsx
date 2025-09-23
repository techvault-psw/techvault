import type { DialogProps } from "@radix-ui/react-dialog";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { format } from "date-fns";

interface RelatorioFinanceiroDialogProps extends DialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  startDate: Date;
  endDate: Date;
}

const resumo = [
  {
    name: "Faturamento total",
    count: "R$ 54.320,00",
  },
  {
    name: "Reservas canceladas",
    count: "103",
  },
  {
    name: "Ticket médio por reserva",
    count: "R$ 527,38",
  },
]

const distribuicaoDiaria = [
  {
    data: '25/08/2025',
    qtdReservas: 13,
    valor: '4.150,00',
  },
  {
    data: '26/08/2025',
    qtdReservas: 7,
    valor: '2.450,00',
  },   
  {
    data: '27/08/2025',
    qtdReservas: 12,
    valor: '3.950,00',
  },   
  {
    data: '28/08/2025',
    qtdReservas: 6,
    valor: '1.750,00',
  },   
  {
    data: '29/08/2025',
    qtdReservas: 1,
    valor: '350,00',
  },   
  {
    data: '30/08/2025',
    qtdReservas: 3,
    valor: '1.100,00',
  },   
  {
    data: '31/08/2025',
    qtdReservas: 8,
    valor: '2.650,00',
  },   
  {
    data: '01/09/2025',
    qtdReservas: 10,
    valor: '3.700,00',
  },   
  {
    data: '02/09/2025',
    qtdReservas: 9,
    valor: '3.500,00',
  },   
  {
    data: '03/09/2025',
    qtdReservas: 11,
    valor: '3.800,00',
  },   
  {
    data: '04/09/2025',
    qtdReservas: 5,
    valor: '1.500,00',
  },   
  {
    data: '05/09/2025',
    qtdReservas: 6,
    valor: '1.750,00',
  },   
  {
    data: '06/09/2025',
    qtdReservas: 4,
    valor: '990,00',
  },   
  {
    data: '07/09/2025',
    qtdReservas: 7,
    valor: '2.200,00',
  },   
  {
    data: '08/09/2025',
    qtdReservas: 9,
    valor: '3.400,00',
  }
]

export const RelatorioFinanceiroDialog = ({ open, setOpen, startDate, endDate, ...props }: RelatorioFinanceiroDialogProps) => {
  if (!startDate || !endDate) return null
  
  const formattedStartDate = format(startDate, "dd/MM/yyyy")
  const formattedEndDate = format(endDate, "dd/MM/yyyy")

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

        <section className="flex flex-col gap-2 overflow-y-hidden">
          <h3 className="font-semibold text-xl text-white mb-1.5">Distribuição por Dia</h3>

          <div className="flex flex-col gap-2 scrollbar">
            <table className="w-full text-gray text-sm">
              <tr className="text-sm border-b border-gray text-white">
                <td className="pb-1">
                  Data
                </td>
                <td className="pb-1 text-center">
                  Qtd Reservas
                </td>
                <td className="pb-1 text-right">
                  Faturamento <span>(R$)</span>
                </td>
              </tr>
              {distribuicaoDiaria.map((dia) => (
                <tr>
                  <td className="pt-1">
                    {dia.data}
                  </td>
                  <td className="pt-1 text-center">
                    {dia.qtdReservas}
                  </td>
                  <td className="pt-1 text-right">
                    {dia.valor}
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </section>
      </Dialog.Content>
    </Dialog.Container>
  );
};
