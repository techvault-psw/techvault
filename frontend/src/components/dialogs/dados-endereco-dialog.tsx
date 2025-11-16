/**
 * @fileoverview Dialog para visualizar e editar dados de endereço
 * 
 * Componente modal que permite ao usuário visualizar e editar informações de um endereço cadastrado.
 * Inclui integração com API ViaCEP para preenchimento automático de dados a partir do CEP,
 * validação de CEP único por cliente e funcionalidade de exclusão de endereço.
 * 
 * @module components/dialogs/DadosEnderecoDialog
 */

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
import { updateEnderecoServer, deleteEnderecoServer } from "@/redux/endereco/fetch";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { estados } from "@/consts/estados";
import { selectAllEnderecos, type Endereco } from "@/redux/endereco/slice";
import { Pen } from "lucide-react";

/**
 * Props do componente DadosEnderecoDialog
 * 
 * @interface DadosEnderecoDialogProps
 * @property {ReactNode} children - Elemento que dispara a abertura do dialog (trigger)
 * @property {Endereco} endereco - Objeto do endereço a ser visualizado/editado
 */
interface DadosEnderecoDialogProps {
    children: ReactNode
    endereco: Endereco
}

/**
 * Schema de validação para o formulário de dados do endereço
 * 
 * @constant
 * @type {z.ZodObject}
 * @property {string} name - Nome/descrição do endereço (obrigatório)
 * @property {string} cep - CEP no formato XXXXX-XXX (obrigatório)
 * @property {string} street - Nome da rua/logradouro (obrigatório)
 * @property {string} number - Número do imóvel, até 6 dígitos opcionalmente seguido de letra
 * @property {string} description - Complemento do endereço (opcional)
 * @property {string} neighborhood - Bairro (obrigatório)
 * @property {string} city - Cidade (obrigatória)
 * @property {string} state - UF do estado (obrigatório, lista de estados válidos)
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
 * Componente de dialog para editar dados de endereço
 * 
 * Permite visualizar e editar informações de um endereço cadastrado, com:
 * - Preenchimento automático de dados via CEP (API ViaCEP)
 * - Validação de unicidade de nome por cliente
 * - Modo de visualização e edição alternáveis
 * - Botões de editar e excluir (apenas em página de perfil ou para gerentes)
 * - Integração com Redux para persistência de dados
 * 
 * @component
 * @param {DadosEnderecoDialogProps} props - Props do componente
 * @param {ReactNode} props.children - Elemento trigger do dialog
 * @param {Endereco} props.endereco - Endereço a ser visualizado/editado
 * @returns {JSX.Element} Dialog com formulário de endereço
 * 
 * @example
 * <DadosEnderecoDialog endereco={endereco}>
 *   <Card.Container>
 *     <Card.Title>{endereco.name}</Card.Title>
 *     <Card.Description>{stringifyAddress(endereco)}</Card.Description>
 *   </Card.Container>
 * </DadosEnderecoDialog>
 */
export const DadosEnderecoDialog = ({ children, endereco }: DadosEnderecoDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [disabled, setDisabled] = useState(true)
    const { isGerente } = useCargo()

    const enderecos = useSelector(selectAllEnderecos)

    const dispatch = useDispatch<AppDispatch>()

    const location = useLocation();
    const fullPath = location.pathname;
    const isProfilePage = fullPath === "/perfil";
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: endereco.name || "",
            cep: endereco.cep || "",
            street: endereco.street || "",
            number: endereco.number || "",
            description: endereco.description || "",
            neighborhood: endereco.neighborhood || "",
            city: endereco.city || "",
            state: endereco.state || ""
        }
    })

    const onSubmit = (newEndereco: z.infer<typeof formSchema>) => {
      const addressFound = enderecos.findIndex((e) => endereco.cliente.id == e.cliente.id && newEndereco.name == e.name);
      if(endereco.name != newEndereco.name && addressFound != -1) {
          form.setError("name", { 
              type: "custom",
              message: isProfilePage ? "Um endereço com este nome já existe" : `Esse cliente já possui um endereço com este nome`
          })
          return
      }

      dispatch(updateEnderecoServer({
        ...newEndereco,
        id: endereco.id,
        cliente: endereco.cliente
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
        dispatch(deleteEnderecoServer(endereco))
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

                        {(isProfilePage || isGerente()) && (
                            <Dialog.Footer className="block text-center space-y-3 items-center">
                                {disabled ? (
                                  <div className="w-full flex gap-3 itens-center">
                                <ExcluirEnderecoDialog endereco={endereco} handleDeleteClick={handleDeleteClick}>
                                    <Button type="button" variant="destructive" className="w-full">
                                        <TrashIcon/>
                                        Excluir
                                    </Button>
                                </ExcluirEnderecoDialog>
                                    <Button type="button" variant="outline" className="w-full" onClick={toggleEditAddressInfo}>
                                      <Pen className="size-4"/>
                                        Editar
                                    </Button>
                                  </div>
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
