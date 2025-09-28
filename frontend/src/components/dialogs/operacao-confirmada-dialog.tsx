import { Dialog } from "../ui/dialog";
import type { Reserva } from "@/consts/reservas";
import { pacotes } from "@/consts/pacotes"
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/root-reducer";

interface OperacaoConfirmadaDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    reserva: Reserva
    tipo: string | undefined
}

export const OperacaoConfirmadaDialog = ({ tipo, reserva, open, setOpen }: OperacaoConfirmadaDialogProps) => {
  const { pacotes } = useSelector((state: RootState) => state.pacotesReducer)
  
  const pacoteName = pacotes[reserva.pacoteIndex].name

    return tipo && (
        <Dialog.Container open={open} onOpenChange={setOpen}>
            <Dialog.Content>
                <Dialog.Title>{tipo} confirmada!</Dialog.Title>

                <Dialog.Description>A {tipo.toLowerCase()} do pacote "{pacoteName}" foi confirmada com sucesso!</Dialog.Description>
            </Dialog.Content>
        </Dialog.Container>
    );
}
