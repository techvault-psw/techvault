import { useLocation, useNavigate, useParams } from "react-router";
import { useDispatch } from 'react-redux';
import { addReserva, type NewReserva, type Reserva } from '@/redux/reservas/slice';



import * as z from "zod";

import { HighlightBox } from "@/components/highlight-box";
import { PacoteImage } from "@/components/pacote-image";
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { formatCurrency } from "@/lib/format-currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/root-reducer";
import { clientes } from "@/consts/clientes";
import { useEffect } from "react";
import { CriarEnderecoDialog } from "@/components/dialogs/criar-endereco-dialog";
import { PlusIcon } from "@/components/icons/plus-icon";

const metodosPagamento = [
  "Cartão de Crédito",
  "Cartão de Débito",
  "Pix"
]

const formSchema = z
  .object({
    dataHoraInicial: z.date({ message: "Por favor, preencha a data inicial" }),
    dataHoraFinal: z.date({ message: "Por favor, preencha a data final" }),
    endereco: z.string()
      .min(1, { message: "Por favor, selecione um endereço" }),
    metodoPagamento: z.string()
      .min(1, { message: "Por favor, selecione um método" })
      .refine(
        (metodo) => metodosPagamento.includes(metodo),
        { message: "Método inválido" }
      ),

  })
  .refine((data) => data.dataHoraInicial <= data.dataHoraFinal, {
    message: "Data final não pode ser antes que a data inicial",
    path: ["dataHoraFinal"],
  });

type FormData = z.infer<typeof formSchema>;

export default function ConfirmarReservaPage() {
  const { enderecos } = useSelector((rootReducer: RootState) => rootReducer.enderecosReducer)
  const { pacotes } = useSelector((state: RootState) => state.pacotesReducer)
  const { reservas } = useSelector((state: RootState) => state.reservasReducer)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataHoraInicial: undefined,
      dataHoraFinal: undefined,
      endereco: "",
      metodoPagamento: ""
    },
    mode: "onChange"
  });

  const dispatch = useDispatch();

  const onSubmit = (data: FormData) => {
    const endereco = enderecos.find(endereco => endereco.name === data.endereco)

    if (!clienteAtual || !endereco) return;

    const novaReserva: NewReserva = {
      pacote: pacotes[numberId],
      status: "Confirmada" as const,
      dataInicio: data.dataHoraInicial.toISOString(),
      dataTermino: data.dataHoraFinal.toISOString(),
      endereco,
      cliente: clienteAtual,
    };
    navigate(`/pagamento/${reservas.length}`);
    dispatch(addReserva(novaReserva));
  };

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const numberId = Number(id)

  if (isNaN(numberId) || numberId >= pacotes.length) {
    return
  }

  const { clienteAtual } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)
  const enderecosCliente = enderecos.filter((endereco) => endereco.cliente.id === clienteAtual?.id)

  const location = useLocation()

  useEffect(() => {
    if (!clienteAtual) {
      const fullPath = location.pathname + location.search + location.hash;
      navigate(`/login?redirectTo=${encodeURIComponent(fullPath)}`)
    }
  }, [])

  return (
    <PageContainer.Card>
      <PageTitle>
        Confirmar Reserva
      </PageTitle>

      <Separator />

      <div className="flex md:flex-col items-center gap-3">
        <PacoteImage
          pacote={pacotes[numberId]}
          className="h-22 md:h-66 xl:h-77"
        />
        <span className="text-white font-medium text-xl sm:text-2xl sm:font-semibold">{pacotes[numberId].name}</span>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4 overflow-y-hidden">
          <h3 className="font-semibold text-white text-lg lg:text-xl leading-none mb-2">Informações da reserva</h3>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 scrollbar">
            <FormField
              control={form.control}
              name="dataHoraInicial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data e Hora de Início</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      minuteStep={15}
                      placeholder="Selecione uma data"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataHoraFinal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data e Hora de Término</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      minuteStep={15}
                      placeholder="Selecione uma data"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endereco"
              render={({ field, fieldState }) => (
                <FormItem className="!opacity-100 [&:has([data-disabled])]:!opacity-60">
                  <FormLabel>Endereço de Entrega</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Selecione um endereço" />
                      </SelectTrigger>
                      <SelectContent>
                        {enderecosCliente.length === 0 ? (
                          <div className="p-2 text-sm text-gray/60">
                            Nenhum endereço cadastrado
                          </div>
                        ) : (
                          enderecosCliente.map((endereco, index) => (
                            <SelectItem key={index} value={endereco.name}>
                              {endereco.name}
                            </SelectItem>
                          ))
                        )}
                        <Separator className="my-1" />

                        <CriarEnderecoDialog>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start font-normal text-gray"
                          >
                            <PlusIcon className="size-4" />
                            Adicionar novo endereço
                          </Button>
                        </CriarEnderecoDialog>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metodoPagamento"
              render={({ field, fieldState }) => (
                <FormItem className="!opacity-100 [&:has([data-disabled])]:!opacity-60">
                  <FormLabel>Método de Pagamento</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Selecione um método" />
                      </SelectTrigger>
                      <SelectContent>
                        {metodosPagamento.map((metodo) => (
                          <SelectItem key={metodo} value={metodo}>
                            {metodo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col mt-auto md:flex-row gap-4">
            <HighlightBox className="md:max-w-1/2 min-[880px]:max-w-1/3 min-[880px]:text-center">
              Valor (hora): {formatCurrency(pacotes[numberId].value)}
            </HighlightBox>

            <Button type="submit" size="lg" className="flex-none md:max-w-1/2 min-[880px]:!max-w-2/3">
              Reservar Agora
            </Button>
          </div>
        </form>
      </Form>


    </PageContainer.Card>
  )
}
