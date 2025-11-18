/**
 * @fileoverview Dialog de confirmação de operação de entrega/coleta
 * 
 * Componente de dialog para validação e confirmação de operações de entrega
 * ou coleta de reservas mediante verificação de código. Utilizado por usuários
 * suporte/gerente para registrar entregas e coletas de pacotes.
 * 
 * @module components/dialogs/ConfirmarOperacaoDialog
 */

import { useState, type ReactNode } from "react";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { type Reserva } from "@/redux/reservas/slice";
import { coletarReservaServer, entregarReservaServer } from "@/redux/reservas/fetch";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/redux/store";

/**
 * Props do componente ConfirmarOperacaoDialog
 * 
 * @interface ConfirmarOperacaoDialogProps
 * @property {ReactNode} children - Elemento trigger que abre o dialog
 * @property {Reserva} reserva - Objeto da reserva a ser confirmada
 * @property {"Entrega" | "Coleta"} tipo - Tipo de operação
 * @property {Function} [onSuccess] - Callback executado após confirmação bem-sucedida
 */    
interface ConfirmarOperacaoDialogProps {
    children: ReactNode,
    reserva: Reserva,
    tipo: "Entrega" | "Coleta"
    onSuccess?: (reserva: Reserva, tipo: "Entrega" | "Coleta") => void
}

/**
 * Schema de validação para o código de confirmação
 * 
 * @constant
 * @type {z.ZodObject}
 * @property {string} code - Código de 7 caracteres (4 letras maiúsculas e 3 dígitos)
 */
const formSchema = z
    .object({
        code: z.string()
            .min(1, { message: "Insira um código válido" })
            .length(7, { message: "O código deve ter exatamente 7 caracteres" })
            .regex(
                /^(?=(?:.*[A-Z]){4})(?=(?:.*\d){3})[A-Z\d]{7}$/,
                { message: "O código deve conter 4 letras maiúsculas e 3 dígitos" }
            )
})

/**
 * Componente Dialog de confirmação de operação
 * 
 * Exibe um formulário para validação de código de entrega ou coleta:
 * - Valida formato do código (7 caracteres: 4 letras + 3 dígitos)
 * - Verifica se operação já foi realizada
 * - Confirma que coleta só pode ocorrer após entrega
 * - Compara código inserido com código armazenado na reserva
 * - Atualiza status da reserva no servidor
 * 
 * @component
 * @param {ConfirmarOperacaoDialogProps} props - Props do componente
 * @param {ReactNode} props.children - Trigger para abrir dialog
 * @param {Reserva} props.reserva - Reserva a ser confirmada
 * @param {"Entrega" | "Coleta"} props.tipo - Tipo de operação
 * @param {Function} [props.onSuccess] - Callback de sucesso
 * @returns {JSX.Element} Dialog de confirmação
 * 
 * @example
 * <ConfirmarOperacaoDialog 
 *   reserva={reserva} 
 *   tipo="Entrega"
 *   onSuccess={(reserva, tipo) => console.log('Confirmado!')}
 * >
 *   <Button>Confirmar Entrega</Button>
 * </ConfirmarOperacaoDialog>
 */
export const ConfirmarOperacaoDialog = ({ children, reserva, tipo, onSuccess }: ConfirmarOperacaoDialogProps) => {
    const [isOpen, setOpen] = useState(false)
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: ""
        }
    })

    const dispatch = useDispatch<AppDispatch>()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (
            (reserva.dataEntrega && tipo === "Entrega") ||
            (reserva.dataColeta && tipo === "Coleta")
        ) {
            form.setError("code", { type: "manual", message: "Operação inválida!" })
            return
        }

        if (tipo === "Coleta" && !reserva.dataEntrega) {
            form.setError("code", { type: "manual", message: "Não é possível coletar antes da entrega!" });
            return;
        }

        if (
            (tipo === "Entrega" && values.code !== reserva.codigoEntrega) ||
            (tipo === "Coleta" && values.code !== reserva.codigoColeta)
        ) {
            form.setError("code", { type: "manual", message: `Código de ${tipo.toLocaleLowerCase()} inválido!` })
            return
        }

        if (tipo === 'Entrega') {
            await dispatch(entregarReservaServer({ reserva, codigoEntrega: values.code }))
        } else if (tipo === 'Coleta') {
            await dispatch(coletarReservaServer({ reserva, codigoColeta: values.code }))
        }

        form.reset()
        onSuccess?.(reserva, tipo)
        setOpen(false)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit(onSubmit)(e);
    }
    
    return (
        <>
        <Dialog.Container open={isOpen} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>

            <Dialog.Content>
                <Dialog.Title>Insira o Código</Dialog.Title>

                <Separator/>

                <Form {...form}>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código de {tipo}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="A1B2C3D" type="text" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Dialog.Footer>
                            <Dialog.Close asChild>
                                <Button variant="outline" type="button">
                                    Cancelar
                                </Button>
                            </Dialog.Close>
                            <Button className="h-[2.625rem]" type="submit">
                                Confirmar
                            </Button>
                        </Dialog.Footer>
                    </form>
                </Form>
            </Dialog.Content>
        </Dialog.Container>
        </>
    );
}
