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
import { OperacaoConfirmadaDialog } from "./operacao-confirmada-dialog";
import { useDispatch } from "react-redux";

interface ConfirmarOperacaoDialogProps {
    children: ReactNode,
    reserva: Reserva,
    tipo: "Entrega" | "Coleta"
}

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

export const ConfirmarOperacaoDialog = ({ children, reserva, tipo }: ConfirmarOperacaoDialogProps) => {
    const [isOpen, setOpen] = useState(false)
    const [isConfirmedOpen, setConfirmedOpen] = useState(false)
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: ""
        }
    })

    const dispatch = useDispatch()

    const onSubmit = (values: z.infer<typeof formSchema>) => {
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

        form.reset()
        setConfirmedOpen(true)
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

        <OperacaoConfirmadaDialog
            reserva={reserva}
            tipo={tipo}
            open={isConfirmedOpen}
            setOpen={setConfirmedOpen}
        />
        </>
    );
}
