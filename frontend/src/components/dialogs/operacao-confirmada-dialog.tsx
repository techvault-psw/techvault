/**
 * @fileoverview Dialog de feedback de operação confirmada
 * 
 * Componente de dialog simples para exibir confirmação de que uma operação
 * de entrega ou coleta foi realizada com sucesso.
 * 
 * @module components/dialogs/OperacaoConfirmadaDialog
 */

import { Dialog } from "../ui/dialog";
import { type Reserva } from "@/redux/reservas/slice";

/**
 * Props do componente OperacaoConfirmadaDialog
 * 
 * @interface OperacaoConfirmadaDialogProps
 * @property {boolean} open - Estado de abertura do dialog
 * @property {Function} setOpen - Função para controlar abertura/fechamento
 * @property {Reserva} reserva - Objeto da reserva confirmada
 * @property {string | undefined} tipo - Tipo de operação ("Entrega" ou "Coleta")
 */
interface OperacaoConfirmadaDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    reserva: Reserva
    tipo: string | undefined
}

/**
 * Componente Dialog de operação confirmada
 * 
 * Exibe mensagem de sucesso após confirmação de entrega ou coleta:
 * - Título com tipo da operação
 * - Mensagem confirmando a operação e nome do pacote
 * 
 * @component
 * @param {OperacaoConfirmadaDialogProps} props - Props do componente
 * @param {boolean} props.open - Estado de abertura
 * @param {Function} props.setOpen - Controle de abertura
 * @param {Reserva} props.reserva - Reserva confirmada
 * @param {string | undefined} props.tipo - Tipo de operação
 * @returns {JSX.Element | false} Dialog de confirmação ou false se tipo não definido
 * 
 * @example
 * <OperacaoConfirmadaDialog
 *   open={showDialog}
 *   setOpen={setShowDialog}
 *   reserva={reserva}
 *   tipo="Entrega"
 * />
 */
export const OperacaoConfirmadaDialog = ({ tipo, reserva, open, setOpen }: OperacaoConfirmadaDialogProps) => {
    return tipo && (
        <Dialog.Container open={open} onOpenChange={setOpen}>
            <Dialog.Content>
                <Dialog.Title>{tipo} confirmada!</Dialog.Title>

                <Dialog.Description>A {tipo.toLowerCase()} do pacote "{reserva.pacote.name}" foi confirmada com sucesso!</Dialog.Description>
            </Dialog.Content>
        </Dialog.Container>
    );
}
