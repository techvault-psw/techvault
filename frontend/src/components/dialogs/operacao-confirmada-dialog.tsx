import { Dialog } from "../ui/dialog";
import type { Reserva } from "@/consts/reservas";
import { pacotes } from "@/consts/pacotes"

interface OperacaoConfirmadaDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    reserva: Reserva
    tipo: "Entrega" | "Coleta"
}

export const OperacaoConfirmadaDialog = ({ tipo, reserva, open, setOpen }: OperacaoConfirmadaDialogProps) => {
    return (
        <Dialog.Container open={open} onOpenChange={setOpen}>
            <Dialog.Content>
                <Dialog.Title>{tipo} confirmada!</Dialog.Title>

                <Dialog.Description>A {tipo} do reserva {pacotes[reserva.pacoteIndex].name} foi confirmada com sucesso!</Dialog.Description>
            </Dialog.Content>
        </Dialog.Container>
    );
}
