import { Dialog } from "../ui/dialog";
import { updateReserva, type Reserva } from "@/redux/reservas/slice";
import { useDispatch } from "react-redux";

interface OperacaoConfirmadaDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    reserva: Reserva
    tipo: string | undefined
}

export const OperacaoConfirmadaDialog = ({ tipo, reserva, open, setOpen }: OperacaoConfirmadaDialogProps) => {
    const dispatch = useDispatch()

    const handleOpenChange = (isOpen: boolean) => {
        const now = new Date().toISOString()

        dispatch(updateReserva({
            ...reserva,
            dataEntrega: tipo === "Entrega" ? now : reserva.dataEntrega,
            dataColeta: tipo === "Coleta" ? now : reserva.dataColeta,
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
