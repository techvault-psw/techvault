/**
 * @fileoverview Página de confirmação de reserva
 * 
 * Página onde o cliente preenche informações para criar uma nova reserva,
 * selecionando datas, endereço de entrega e método de pagamento.
 * 
 * @module pages/ConfirmarReservaPage
 */

import { useLocation, useNavigate, useParams } from "react-router";
import { useDispatch } from 'react-redux';
import { selectAllReservas, type NewReserva } from '@/redux/reservas/slice';

import * as z from "zod";

import { HighlightBox } from "@/components/highlight-box";
import { PacoteImage } from "@/components/pacote-image";
import { PageContainer } from "@/components/page-container";
import { PageTitle, PageTitleContainer } from "@/components/page-title";
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
import { useEffect } from "react";
import { CriarEnderecoDialog } from "@/components/dialogs/criar-endereco-dialog";
import { PlusIcon } from "@/components/icons/plus-icon";
import { addReservaServer } from "@/redux/reservas/fetch";
import { type AppDispatch } from "@/redux/store";
import { selectAllPacotes, selectPacoteById } from "@/redux/pacotes/slice";
import { selectAllEnderecos } from "@/redux/endereco/slice";
import { fetchEnderecos } from "@/redux/endereco/fetch";
import { GoBackButton } from "@/components/go-back-button";

/**
 * Esquema para os métodos de pagamento disponíveis
 * 
 * @constant
 * @type {z.ZodEnum}
 */
const metodosPagamentoSchema = z.enum(
  ["Cartão de Crédito", "Cartão de Débito", "Pix"],
  { message: "Por favor, selecione um método de pagamento" }
)

/**
 * Schema de validação para o formulário de reserva
 * 
 * @constant
 * @type {z.ZodObject}
 * @property {Date} dataHoraInicial - Data/hora de início (deve ser futura e mínimo 12h no futuro)
 * @property {Date} dataHoraFinal - Data/hora de término (após início, duração mín. 15min)
 * @property {string} endereco - ID do endereço de entrega
 * @property {string} metodoPagamento - Método de pagamento selecionado
 */
const formSchema = z
  .object({
    dataHoraInicial: z.date({ message: "Por favor, preencha a data inicial" }),
    dataHoraFinal: z.date({ message: "Por favor, preencha a data final" }),
    endereco: z.string()
      .min(1, { message: "Por favor, selecione um endereço" }),
    metodoPagamento: metodosPagamentoSchema
  })
  .refine((data) => data.dataHoraInicial > new Date(), {
    message: "A data inicial não pode ser no passado",
    path: ["dataHoraInicial"],
  })
  .refine((data) => data.dataHoraInicial <= data.dataHoraFinal, {
    message: "Data final não pode ser antes que a data inicial",
    path: ["dataHoraFinal"],
  })
  .refine((data) => data.dataHoraInicial < data.dataHoraFinal, {
    message: "A reserva deve ter duração mínima de 15 minutos",
    path: ["dataHoraFinal"],
  });

type FormData = z.infer<typeof formSchema>;

/**
 * Componente da página de confirmação de reserva
 * 
 * Permite ao cliente criar uma nova reserva preenchendo:
 * - Data e hora de início (mínimo 12h no futuro, intervalos de 15min)
 * - Data e hora de término (mínimo 12h no futuro, intervalos de 15min)
 * - Endereço de entrega (com opção de criar novo endereço)
 * - Método de pagamento (Cartão de Crédito, Débito ou PIX)
 * - Exibe valor por hora do pacote
 * - Redireciona para página de pagamento após confirmação
 * 
 * Requer autenticação - redireciona para /login se o usuário não estiver autenticado.
 * 
 * @component
 * @returns {JSX.Element} Página de confirmação de reserva
 * 
 * @example
 * // Uso no roteamento
 * <Route path="/confirmar-reserva/:id" element={<ConfirmarReservaPage />} />
 */
export default function ConfirmarReservaPage() {
  const pacotes = useSelector(selectAllPacotes);
  const enderecos = useSelector(selectAllEnderecos)
  const reservas = useSelector(selectAllReservas)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataHoraInicial: undefined,
      dataHoraFinal: undefined,
      endereco: ""
    },
    mode: "onChange"
  });

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const { clienteAtual, token } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)
  const enderecosCliente = enderecos.filter((endereco) => endereco.cliente.id === clienteAtual?.id)

  const location = useLocation()

  const pacote = useSelector((state: RootState) => selectPacoteById(state, id ?? ''))

  const onSubmit = async (data: FormData) => {
    const endereco = enderecos.find(endereco => endereco.id === data.endereco)

    if (!clienteAtual || !endereco || !pacote) return;

    const novaReserva: NewReserva = {
      pacote,
      status: "Confirmada" as const,
      dataInicio: data.dataHoraInicial.toISOString(),
      metodoPagamento: data.metodoPagamento,
      dataTermino: data.dataHoraFinal.toISOString(),
      endereco,
      cliente: clienteAtual,
    };

    const result = await dispatch(addReservaServer(novaReserva));

    if (addReservaServer.fulfilled.match(result)) {
      console.log(result.payload)
      navigate(`/pagamento/${result.payload.id}?metodo=${result.payload.metodoPagamento}`);
    }
  }

  useEffect(() => {
    if (!token) {
      const fullPath = location.pathname + location.search + location.hash;
      navigate(`/login?redirectTo=${encodeURIComponent(fullPath)}`)
    }
  }, [])

  const { status: statusE } = useSelector((rootReducer: RootState) => rootReducer.enderecosReducer)

  useEffect(() => {
    if (['not_loaded', 'saved', 'deleted'].includes(statusE)) {
      dispatch(fetchEnderecos())
    }
  }, [statusE, dispatch])

  if (!id) {
    return
  }

  return (
    <PageContainer.Card>
      <PageTitleContainer>
        <GoBackButton />
        <PageTitle>Confirmar Reserva</PageTitle>
      </PageTitleContainer>

      <Separator />

      <div className="flex md:flex-col items-center gap-3">
        <PacoteImage
          pacote={pacote}
          className="h-22 md:h-66 xl:h-77"
        />
        <span className="text-white font-medium text-xl sm:text-2xl sm:font-semibold">{pacote.name}</span>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4 scrollbar">
          <h3 className="font-semibold text-white text-lg lg:text-xl leading-none mb-2">Informações da reserva</h3>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
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
                      minHoursFromNow={12}
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
                      minHoursFromNow={12}
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
                            <SelectItem key={index} value={String(endereco.id)}>
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
                        {metodosPagamentoSchema.options.map((metodo) => (
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
              Valor (hora): {formatCurrency(pacote.value)}
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
