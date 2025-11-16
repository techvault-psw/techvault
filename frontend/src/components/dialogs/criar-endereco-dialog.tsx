/**
 * @fileoverview Dialog para criação de novo endereço
 * 
 * Componente modal que permite ao usuário cadastrar um novo endereço.
 * Inclui integração com API ViaCEP para preenchimento automático de dados a partir do CEP
 * e validação de duplicação de nomes de endereço para o mesmo cliente.
 * 
 * @module components/dialogs/CriarEnderecoDialog
 */

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
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/redux/root-reducer';
import type { AppDispatch } from '@/redux/store';
import { addEnderecoServer } from '@/redux/endereco/fetch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { estados } from '@/consts/estados';
import { selectAllEnderecos } from '@/redux/endereco/slice';

/**
 * Props do componente CriarEnderecoDialog
 * 
 * @interface DadosClienteDialogProps
 * @property {ReactNode} children - Elemento que dispara a abertura do dialog (trigger)
 */
interface DadosClienteDialogProps {
    children: ReactNode
}

/**
 * Schema de validação para o formulário de criação de endereço
 * 
 * @constant
 * @type {z.ZodObject}
 * @property {string} name - Nome/descrição do endereço (obrigatório)
 * @property {string} cep - CEP no formato XXXXX-XXX (obrigatório)
 * @property {string} street - Nome da rua/logradouro (obrigatório, auto-preenchido via CEP)
 * @property {string} number - Número do imóvel, até 6 dígitos opcionalmente seguido de letra
 * @property {string} description - Complemento do endereço (opcional)
 * @property {string} neighborhood - Bairro (obrigatório, auto-preenchido via CEP)
 * @property {string} city - Cidade (obrigatória, auto-preenchida via CEP)
 * @property {string} state - UF do estado (obrigatório, auto-preenchida via CEP)
 */
const formSchema = z
    .object({
        name: z.string().min(1, { message: "O nome é obrigatório" }),
        cep: z.string().min(1, { message: "O CEP é obrigatório" }).regex(/^\d{5}-\d{3}$/, "Formato inválido. Use: XXXXX-XXX"),
        street: z.string().min(1, { message: "A rua é obrigatória" }),
        number: z.string()
            .min(1, { message: "O número é obrigatório" })
            .trim()
            .regex(/^\d{1,6}[A-Za-z]?$/, "Número inválido"),
        description: z.string(),
        neighborhood: z.string().min(1, { message: "O bairro é obrigatório" }),
        city: z.string().min(1, { message: "A cidade é obrigatória" }),
        state: z.enum(estados, { message: "Selecione um estado válido" })
    })

/**
 * Componente de dialog para criar novo endereço
 * 
 * Permite ao usuário cadastrar um novo endereço com:
 * - Preenchimento automático de dados via CEP (API ViaCEP)
 * - Validação de unicidade de nome para o cliente autenticado
 * - Formulário intuitivo com máscara de CEP
 * - Integração com Redux para persistência de dados
 * 
 * @component
 * @param {DadosClienteDialogProps} props - Props do componente
 * @param {ReactNode} props.children - Elemento trigger do dialog
 * @returns {JSX.Element} Dialog com formulário de criação de endereço
 * 
 * @example
 * <CriarEnderecoDialog>
 *   <Button variant="secondary">
 *     <PlusIcon /> Criar endereço
 *   </Button>
 * </CriarEnderecoDialog>
 */
export const CriarEnderecoDialog = ({ children }: DadosClienteDialogProps) => {
    const [isOpen, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const { clienteAtual } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)
    const enderecos  = useSelector(selectAllEnderecos);

    const dispatch = useDispatch<AppDispatch>()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            cep: "",
            street: "",
            number: "",
            description: "",
            neighborhood: "",
            city: "",
            state: ""
        }
    })

    const onSubmit = (endereco: z.infer<typeof formSchema>) => {
        if (!clienteAtual) return

        const addressFound = enderecos.findIndex((e) => clienteAtual.id == e.cliente.id && endereco.name == e.name);
        if(addressFound != -1) {
            form.setError("name", { 
                type: "custom",
                message: "Um endereço com este nome já existe"
            })
            return
        }

        dispatch(addEnderecoServer({
            ...endereco,
            cliente: clienteAtual
        }))
        setOpen(false);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit(onSubmit)(e);
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
                    <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
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
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Complemento</FormLabel>
                                    <FormControl>
                                        <Input disabled={disabled} placeholder="Fundos" type="text" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <FormControl>
                                            <Select disabled={disabled} onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full rounded-lg disabled:opacity-100" aria-invalid={fieldState.invalid}>
                                                    <SelectValue placeholder="RJ" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {estados.map((estado, index) =>
                                                        <SelectItem key={index} value={estado}>{estado}</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Dialog.Footer className='grid grid-rows-2 md:flex md:flex-row-reverse'>
                            <Button type="submit" className='h-[2.625rem]'>
                                Criar
                            </Button>
                            <Dialog.Close asChild>
                                <Button variant="outline" type="button">
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
