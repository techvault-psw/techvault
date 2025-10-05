import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';

import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import { 
    Form,
    FormField, 
    FormItem, 
    FormLabel, 
    FormControl, 
    FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useHookFormMask } from 'use-mask-input';

import { stringifyAddress } from '@/consts/enderecos';
import { Card } from '@/components/ui/card';
import { LogOutIcon } from '@/components/icons/log-out-icon';
import { TrashIcon } from '@/components/icons/trash-icon';
import { ArrowLeftIcon } from '@/components/icons/arrow-left-icon';
import { PlusIcon } from '@/components/icons/plus-icon';
import { CriarEnderecoDialog } from '@/components/dialogs/criar-endereco-dialog';
import { ExcluirContaDialog } from '@/components/dialogs/excluir-conta-dialog';
import { SairDialog } from '@/components/dialogs/sair-dialog';
import { DadosEnderecoDialog } from '@/components/dialogs/dados-endereco-dialog';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/redux/root-reducer';
import {logoutCliente, selectAllClientes} from '@/redux/clientes/slice';
import { deleteClienteServer, fetchClientes, updateClienteServer } from '@/redux/clientes/fetch';
import type { AppDispatch } from '@/redux/store';

const formSchema = z
    .object({
        name: z.string().min(1, { message: "O nome é obrigatório" }),
        email: z.string()
            .min(1, { message: "O e-mail é obrigatório" })
            .email("Digite um e-mail válido"),
        phone: z.string().min(1, "O telefone é obrigatório").regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido. Use: (XX) XXXXX-XXXX")
    })

export default function PerfilPage() {
    const [formDisabled, setFormDisabled] = useState(true);
    const dispatch = useDispatch<AppDispatch>();
    const { status: statusC, error: errorC, clienteAtual } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)
        useEffect(() => {
        if (['not_loaded', 'saved', 'deleted'].includes(statusC)) {
            dispatch(fetchClientes())
        }
    }, [statusC, dispatch])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: clienteAtual?.name || "",
            email: clienteAtual?.email || "",
            phone: clienteAtual?.phone || ""
        }
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (!clienteAtual) return

        dispatch(updateClienteServer({
            ...clienteAtual,
            ...values,
        }))
        toggleEditProfileInfo()
    }

    const toggleEditProfileInfo = () => {
        setFormDisabled(!formDisabled)
    }
    const handleDeleteClick = () => {
        navigate("/cadastro");
        if(clienteAtual){
            dispatch(deleteClienteServer(clienteAtual));
        }
    }
    const handleLogoutClick = () => {
        navigate("/login");
        dispatch(logoutCliente());
    }

    const registerWithMask = useHookFormMask(form.register)

    const navigate = useNavigate()
    const location = useLocation()
    
    useEffect(() => {
        if (!clienteAtual) {
            navigate(`/login?redirectTo=${location.pathname}`)
        }
    }, [])

    const { enderecos } = useSelector((state: RootState) => state.enderecosReducer);

    const enderecosCliente = enderecos.filter((endereco) => endereco.cliente.id === clienteAtual?.id)

    return (
        <PageContainer.Card>
            <PageTitle>
                Perfil
            </PageTitle>

            <Separator/>

            <div className="flex flex-col gap-4 overflow-y-hidden">
                <h3 className="font-semibold text-white text-lg leading-none">Dados Pessoais</h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-3">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input disabled={formDisabled} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefone</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            disabled={formDisabled} 
                                            type="tel" 
                                            {...registerWithMask("phone", ['(99) 99999-9999'], {
                                                required: true
                                            })}
                                            placeholder="(__) _____-____"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input disabled={formDisabled} type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {['saving'].includes(statusC) ? (
                            <p className="text-lg text-white h-[2.625rem] w-full flex items-center justify-center">Salvando...</p>
                        ) : ['failed'].includes(statusC) ? (
                            <div className="h-[2.625rem] rounded-xl bg-red/10 border border-red text-red flex justify-center items-center">
                                {errorC}
                            </div>
                        ) :  (
                            <div className="flex items-center justify-center lg:w-80 lg:m-auto lg:col-2">
                                <Button type="button" variant="outline" onClick={toggleEditProfileInfo} hidden={!formDisabled}>
                                    Editar informações
                                </Button>
                                <Button className="h-[2.625rem]" type="submit" hidden={formDisabled}>
                                    Salvar alterações
                                </Button>
                            </div>
                        )}
                    </form>
                </Form>

                <Separator/>

                <div className="flex flex-col gap-4 overflow-y-hidden">
                    <div className="w-full flex flex-wrap gap-2 items-center justify-between">
                        <h3 className="font-semibold text-white text-lg leading-none">Endereços</h3>
                        <CriarEnderecoDialog>
                            <Button size="sm" variant="secondary" className='flex-none px-3 lg:hidden'>
                                <PlusIcon/>
                                Criar endereço
                            </Button>
                        </CriarEnderecoDialog>
                    </div>

                    {!enderecosCliente.length && (
                        <p className='text-base text-gray text-center'>
                            Você ainda não possui nenhum endereço cadastrado.
                        </p>
                    )}

                    <div className="lg:grid lg:grid-cols-2 xl:grid-cols-3 flex flex-col gap-3 scrollbar">
                        {enderecosCliente.map((endereco) => {
                            return (
                                <DadosEnderecoDialog endereco={endereco}>
                                    <Card.Container>
                                        <Card.TextContainer className='overflow-x-hidden'>
                                            <Card.Title className='truncate'>{endereco.name}</Card.Title>
                                            <Card.Description>{stringifyAddress(endereco)}</Card.Description>
                                        </Card.TextContainer>
                                    </Card.Container>
                                </DadosEnderecoDialog>
                            )
                        })}
                    </div>
                </div>
                <CriarEnderecoDialog>
                    <Button variant="outline" className='hidden lg:flex lg:w-80 m-auto'>
                        Criar endereço
                    </Button>
                </CriarEnderecoDialog>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 w-full lg:grid-rows-1 lg:grid-cols-2 lg:w-120 gap-3 mt-auto mx-auto">
                <ExcluirContaDialog handleDeleteClick={handleDeleteClick}>
                    <Button variant="destructive">
                        <TrashIcon/>
                        Excluir
                    </Button>
                </ExcluirContaDialog>
                <SairDialog handleCloseClick={handleLogoutClick}>
                    <Button variant="destructive">
                        <LogOutIcon/>
                        Sair
                    </Button>
                </SairDialog>
                <Button variant="outline" className='col-span-2' onClick={() => history.back()}>
                    <ArrowLeftIcon/>
                    Voltar
                </Button>
            </div>
        </PageContainer.Card>
    )
}