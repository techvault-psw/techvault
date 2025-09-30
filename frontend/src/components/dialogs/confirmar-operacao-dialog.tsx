import { useState, type ReactNode } from "react";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { Reserva } from "@/redux/reservas/slice";
import { OperacaoConfirmadaDialog } from "./operacao-confirmada-dialog";

interface ConfirmarOperacaoDialogProps {
    children: ReactNode,
    reserva: Reserva,
    tipo: string | undefined
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

    const onSubmit = (form: z.infer<typeof formSchema>) => {
        setConfirmedOpen(true)
        setOpen(false)
    }
    
    return (
        <>
        <Dialog.Container open={isOpen} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>

            <Dialog.Content>
                <Dialog.Title>Insira o Código</Dialog.Title>

                <Separator/>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código</FormLabel>
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
                            <Button className="h-[2.625rem]">
                                Confirmar
                            </Button>
                        </Dialog.Footer>
                    </form>
                </Form>
            </Dialog.Content>
        </Dialog.Container>

        <OperacaoConfirmadaDialog reserva={reserva} tipo={tipo} open={isConfirmedOpen} setOpen={setConfirmedOpen}/>
        </>
    );
}
