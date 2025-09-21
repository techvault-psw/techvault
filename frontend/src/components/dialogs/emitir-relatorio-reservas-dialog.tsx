import { ChevronDownIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import { Dialog } from "../ui/dialog";
import { FormItem } from "../ui/form";
import { Label } from "../ui/input";
import { Separator } from "../ui/separator";
import { RelatorioReservasDialog } from "./relatorio-reservas-dialog";

const relatorioSchema = z
  .object({
    dataInicial: z.date({ message: "Por favor, preencha ambas as datas" }),
    dataFinal: z.date({ message: "Por favor, preencha ambas as datas" }),
  })
  .refine((data) => data.dataInicial <= data.dataFinal, {
    message: "Data inicial não pode ser maior que data final",
    path: ["dataInicial"],
  });

type RelatorioFormData = z.infer<typeof relatorioSchema>;

export const EmitirRelatorioReservasDialog = ({ children }: { children: ReactNode }) => {
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RelatorioFormData>({
    resolver: zodResolver(relatorioSchema),
    mode: "onChange",
  });

  const dataInicial = watch("dataInicial");
  const dataFinal = watch("dataFinal");

  const onSubmit = (data: RelatorioFormData) => {
    setSuccessDialogOpen(true);
  };

  const handleDataInicialChange = (date: Date | undefined) => {
    setValue("dataInicial", date as Date, { shouldValidate: true });
  };

  const handleDataFinalChange = (date: Date | undefined) => {
    setValue("dataFinal", date as Date, { shouldValidate: true });
  };

  const errorMessage = errors.dataInicial?.message || errors.dataFinal?.message

  return (
    <>
      <Dialog.Container>
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>

        <Dialog.Content>
          <Dialog.Title>Relatório de Reservas</Dialog.Title>
          <Separator />
          <Dialog.Description>
            Selecione o período desejado para gerar o relatório de reservas.
          </Dialog.Description>
          <Dialog.Description>
            Esse relatório mostra todas as reservas realizadas no intervalo escolhido.
          </Dialog.Description>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="w-full flex gap-2 items-start">
              <FormItem className="flex-1">
                <Label htmlFor="dataInicial">Data inicial</Label>
                <DatePicker open={open1} setOpen={setOpen1} date={dataInicial} setDate={handleDataInicialChange}>
                  <Button
                    variant="outline"
                    type="button"
                    id="dataInicial"
                    className={`leading-none w-full px-3 py-2 bg-gray/5 backdrop-blur-sm rounded-lg border text-base flex justify-between ${
                      errorMessage ? "border-red-500" : "border-gray/50"
                    }`}
                  >
                    {dataInicial ? dataInicial.toLocaleDateString() : <span className="text-gray">Escolher data</span>}
                    <ChevronDownIcon />
                  </Button>
                </DatePicker>
              </FormItem>

              <FormItem className="flex-1">
                <Label htmlFor="dataFinal">Data final</Label>
                <DatePicker open={open2} setOpen={setOpen2} date={dataFinal} setDate={handleDataFinalChange}>
                  <Button
                    variant="outline"
                    type="button"
                    id="dataFinal"
                    className={`leading-none w-full px-3 py-2 bg-gray/5 backdrop-blur-sm rounded-lg border text-base flex justify-between ${
                      errorMessage ? "border-red-500" : "border-gray/50"
                    }`}
                  >
                    {dataFinal ? dataFinal.toLocaleDateString() : <span className="text-gray">Escolher data</span>}
                    <ChevronDownIcon />
                  </Button>
                </DatePicker>
              </FormItem>
            </div>

            {errorMessage && (
              <p className="text-red text-sm font-medium leading-none -mt-2">{errorMessage}</p>
            )}

            <Button type="submit" className="font-semibold py-3 w-full">
              Emitir relatório
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Container>

      <RelatorioReservasDialog open={successDialogOpen} setOpen={setSuccessDialogOpen} />
    </>
  );
};
