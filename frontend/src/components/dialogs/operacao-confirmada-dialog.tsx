import { updateReservaServer } from "@/redux/reservas/fetch";
import { Dialog } from "../ui/dialog";
import { type Reserva } from "@/redux/reservas/slice";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/redux/store";

interface OperacaoConfirmadaDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    reserva: Reserva
    tipo: string | undefined
}

export const OperacaoConfirmadaDialog = ({ tipo, reserva, open, setOpen }: OperacaoConfirmadaDialogProps) => {
    const dispatch = useDispatch<AppDispatch>()

    const handleOpenChange = (isOpen: boolean) => {
        const now = new Date().toISOString()

        dispatch(updateReservaServer({
            ...reserva,
            dataEntrega: tipo === "Entrega" ? now : reserva.dataEntrega,
            dataColeta: tipo === "Coleta" ? now : reserva.dataColeta,
            status: tipo === "Coleta" ? "Concluída" : reserva.status,
        }))

        setOpen(isOpen)
    }

    return tipo && (
        <Dialog.Container open={open} onOpenChange={handleOpenChange}>
            <Dialog.Content>
                <Dialog.Title>{tipo} confirmada!</Dialog.Title>

                <Dialog.Description>A {tipo.toLowerCase()} do pacote "{reserva.pacote.name}" foi confirmada com sucesso!</Dialog.Description>
            </Dialog.Content>
        </Dialog.Container>
    );
}
