import { type Endereco } from "@/consts/enderecos";
import { useEffect, useState, type ReactNode } from "react";
import { Dialog } from "../ui/dialog";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormMask } from "use-mask-input";
import { TrashIcon } from "../icons/trash-icon";

import { type MouseEvent } from "react";
import { ExcluirEnderecoDialog } from "./excluir-endereco-dialog";
import { useLocation, useNavigate } from "react-router";
import useCargo from "@/hooks/useCargo";

import { useDispatch } from "react-redux";
import { deleteAddress, updateAddress } from "@/redux/endereco/slice";

interface DadosEnderecoDialogProps {
    children: ReactNode
    endereco: Endereco
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

export const DadosEnderecoDialog = ({ children, endereco }: DadosEnderecoDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [disabled, setDisabled] = useState(true)
    const { isGerente } = useCargo()

    const dispatch = useDispatch()

    const location = useLocation();
    const fullPath = location.pathname;
    const isProfilePage = fullPath === "/perfil";
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: endereco.name || "",
            cep: endereco.cep || "",
            street: endereco.street || "",
            number: endereco.number.toString() || "",
            neighborhood: endereco.neighborhood || "",
            city: endereco.city || "",
            state: endereco.state || ""
        }
    })

    const onSubmit = (newEndereco: z.infer<typeof formSchema>) => {
        dispatch(updateAddress({
            ...endereco,
            ...newEndereco
        }))
        setDisabled(true)
        form.reset(newEndereco)
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
        }
    }, [cep, form]);

    useEffect(() => {
        if(!isOpen) {
            form.reset()
            setDisabled(true)
        }
    }, [isOpen, disabled])

    const toggleEditAddressInfo = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setDisabled(!disabled)
    }

    const handleDeleteClick = () => {
        dispatch(deleteAddress(endereco.id))
        setIsOpen(false)
    }

    return (
        <Dialog.Container open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>

            <Dialog.Content>
                <Dialog.Title>Dados do Endereço</Dialog.Title>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input disabled={disabled} type="text" placeholder="Festa" {...field}/>
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
                                            disabled={disabled}
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

                        {(isProfilePage || isGerente()) && (
                            <Dialog.Footer className="block text-center space-y-3 items-center">
                                <ExcluirEnderecoDialog endereco={endereco} handleDeleteClick={handleDeleteClick}>
                                    <Button type="button" variant="destructive" className="w-full">
                                        <TrashIcon/>
                                        Excluir endereço
                                    </Button>
                                </ExcluirEnderecoDialog>
                                {disabled ? (
                                    <Button type="button" variant="outline" className="w-full" onClick={toggleEditAddressInfo}>
                                        Editar informações
                                    </Button>
                                ) : (
                                    <Button type="submit" className="w-full h-[2.625rem]">
                                        Salvar alterações
                                    </Button>
                                )}
                                
                            </Dialog.Footer>
                        )}
                    </form>
                </Form>
            </Dialog.Content>
        </Dialog.Container>
    );
}
