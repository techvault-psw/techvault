import { Dialog } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { useHookFormMask } from 'use-mask-input';
import z from 'zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { addAddress } from '@/redux/endereco/slice';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/redux/root-reducer';
import { clientes } from '@/consts/clientes';

interface DadosClienteDialogProps {
    children: ReactNode
}

const formSchema = z
    .object({
        name: z.string().min(1, { message: "O nome é obrigatório" }),
        cep: z.string().min(1, { message: "O CEP é obrigatório" }).regex(/^\d{5}-\d{3}$/, "Formato inválido. Use: XXXXX-XXX"),
        street: z.string().min(1, { message: "A rua é obrigatória" }),
        number: z.string()
            .min(1, { message: "O número é obrigatório" })
            .trim()
            .regex(/^\d{1,6}[A-Za-z]?$/, "Número inválido"),
        neighborhood: z.string().min(1, { message: "O bairro é obrigatório" }),
        city: z.string().min(1, { message: "A cidade é obrigatória" }),
        state: z.string().min(1, { message: "O estado é obrigatório" })
    })

export const CriarEnderecoDialog = ({ children }: DadosClienteDialogProps) => {
    const [isOpen, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const { enderecos } = useSelector((rootReducer: RootState) => rootReducer.enderecosReducer)

    const dispatch = useDispatch()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            cep: "",
            street: "",
            number: "",
            neighborhood: "",
            city: "",
            state: ""
        }
    })

    const onSubmit = (endereco: z.infer<typeof formSchema>) => {
        dispatch(addAddress({
            ...endereco,
            cliente: clientes[0]
        }))
        setOpen(false);
    }

    const registerWithMask = useHookFormMask(form.register)

    const cep = form.watch("cep")
    const cepCompleto = cep.replace("_", "").length == 9

    const fetchCep = () => {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then((res) => res.json())
            .then((data) => {
                if(!data.erro) {
                    form.setValue("street", data.logradouro || "");
                    form.setValue("neighborhood", data.bairro || "");
                    form.setValue("city", data.localidade || "");
                    form.setValue("state", data.uf || "");
                    form.clearErrors("cep")
                    setDisabled(false)
                } else {
                        form.setError("cep", { 
                        type: "custom",
                        message: "CEP não encontrado" 
                    })
                }
            })
            .catch((err) => {
                form.setError("cep", { 
                    type: "custom",
                    message: "Erro ao obter dados do CEP"
                })
                console.error(err)
            });
    }

    useEffect(() => {
        if(cepCompleto) {
            fetchCep();
        } else {
            setDisabled(true)
        }
    }, [cep, form]);

    useEffect(() => {
        if(!isOpen) {
            form.reset()
        }
    }, [isOpen])

    return (
        <Dialog.Container open={isOpen} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>

            <Dialog.Content>
                <Dialog.Title>Criar novo endereço</Dialog.Title>

                <Separator/>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Festa" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cep"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>CEP</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="text" 
                                            {...field}
                                            {...registerWithMask("cep", ['99999-999'], {
                                                required: true
                                            })}
                                            placeholder="_____-___"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='grid grid-cols-[3fr_1fr] gap-3'>
                            <FormField
                                control={form.control}
                                name="street"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Rua</FormLabel>
                                        <FormControl>
                                            <Input disabled={disabled} placeholder="Rua das Festas" type="text" {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="number"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Número</FormLabel>
                                        <FormControl>
                                            <Input disabled={disabled} type="text" placeholder="456" {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="neighborhood"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Bairro</FormLabel>
                                    <FormControl>
                                        <Input disabled={disabled} type="text" placeholder="Tijuca" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='grid grid-cols-[3fr_1fr] gap-3'>
                            <FormField
                                control={form.control}
                                name="city"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Cidade</FormLabel>
                                        <FormControl>
                                            <Input disabled={disabled} type="text" placeholder="Rio de Janeiro" {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="state"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <FormControl>
                                            <Input disabled={disabled} type="text" placeholder="RJ" {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Dialog.Footer className='grid grid-rows-2 md:flex md:flex-row-reverse'>
                            <Button type="submit">
                                Criar
                            </Button>
                            <Dialog.Close asChild>
                                <Button variant="outline">
                                    Cancelar
                                </Button>
                            </Dialog.Close>
                        </Dialog.Footer>
                    </form>
                </Form>
            </Dialog.Content>
        </Dialog.Container>
    )
}