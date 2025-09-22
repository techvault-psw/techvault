import { useNavigate, useParams } from "react-router";

import * as z from "zod";

import { HighlightBox } from "@/components/highlight-box";
import { PacoteImage } from "@/components/pacote-image";
import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { pacotes } from "@/consts/pacotes";
import { enderecos, type Endereco } from "@/consts/enderecos";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCurrency } from "@/lib/format-currency";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const metodosPagamento = [
    "Cartão de Crédito",
    "Cartão de Débito",
    "Pix"
]

const formSchema = z
    .object({
        dataHoraInicial: z.date({message: "Por favor, preencha a data inicial"}),
        dataHoraFinal: z.date({message: "Por favor, preencha a data final"}),
        endereco: z.string()
            .min(1, { message: "Por favor, selecione um endereço" })
            .refine(
                (endereco) => enderecos.some(e => e.name === endereco),
                { message: "Endereço inválido" }
            ),
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

    const {
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = form

    const onSubmit = (x: FormData) => {
        navigate(`/pagamento/${numberId}`)
    };

    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();

    const numberId = Number(id)

    if (isNaN(numberId) || numberId >= pacotes.length) {
        return
    }

    return (
        <PageContainer.Card>
            <PageTitle>
                Confirmar Reserva
            </PageTitle>

            <Separator/>

            <div className="flex md:flex-col items-center gap-3">
                <PacoteImage
                    pacote={pacotes[numberId]}
                    className="h-22 md:h-66 xl:h-77"
                />
                <span className="text-white font-medium text-xl sm:text-2xl sm:font-semibold">{pacotes[numberId].name}</span>
            </div>

            <Separator/>

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
                                    <Input 
                                        type="datetime-local" 
                                        {...field} 
                                        value={field.value ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''} 
                                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                                        lang="pt-BR"
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
                                        <Input 
                                            type="datetime-local" 
                                            {...field} 
                                            value={field.value ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''} 
                                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                                            lang="pt-BR"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endereco"
                            render={({ field }) => (
                                <FormItem className="!opacity-100 [&:has(select:disabled)]:!opacity-60">
                                    <FormLabel>Endereço de Entrega</FormLabel>
                                    <FormControl>
                                        <select 
                                            {...field}
                                            className="w-full bg-gray/5 backdrop-blur-sm text-gray-200 p-2 rounded-lg border border-gray/50 focus:outline-none focus:ring-2 focus:ring-white"
                                        >
                                            <option value="" disabled className="text-gray-400">Selecione um endereço</option>
                                            {enderecos.map((endereco, index) => {
                                                return (
                                                    <option key={index} value={endereco.name} className="text-black">{endereco.name}</option>
                                                )
                                            })}
                                        </select>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="metodoPagamento"
                            render={({ field }) => (
                                <FormItem className="!opacity-100 [&:has(select:disabled)]:!opacity-60">
                                    <FormLabel>Método de Pagamento</FormLabel>
                                    <FormControl>
                                        <select 
                                            {...field}
                                            className="w-full bg-gray/5 backdrop-blur-sm text-gray-200 p-2 rounded-lg border border-gray/50 focus:outline-none focus:ring-2 focus:ring-white"
                                        >
                                            <option value="" disabled className="text-gray-400">Selecione um método de pagamento</option>
                                            {metodosPagamento.map((metodo) => {
                                                return (
                                                    <option key={metodo} value={metodo} className="text-black">{metodo}</option>
                                                )
                                            })}
                                        </select>
                                    </FormControl>
                                    <FormMessage/>
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
