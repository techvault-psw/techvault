/**
 * @fileoverview Dialog de confirmação de logout
 * 
 * Componente de diálogo modal que solicita confirmação do usuário
 * antes de realizar o logout da sessão atual.
 * 
 * @module components/dialogs/SairDialog
 */

import type { ReactNode } from "react"
import { Dialog } from "../ui/dialog"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { ArrowLeftIcon } from "../icons/arrow-left-icon"
import { LogOutIcon } from "lucide-react"

/**
 * Props do componente SairDialog
 * 
 * @interface SairDialogProps
 * @property {ReactNode} children - Elemento que abrirá o dialog quando clicado
 * @property {Function} handleCloseClick - Função executada quando o usuário confirma o logout
 */
interface SairDialogProps {
    children: ReactNode,
    handleCloseClick: () => void
}

/**
 * Componente de diálogo de confirmação de logout
 * 
 * Exibe um modal de confirmação antes de deslogar o usuário do sistema.
 * Oferece duas opções:
 * - Confirmar logout (executa handleCloseClick)
 * - Cancelar e voltar
 * 
 * @component
 * @param {SairDialogProps} props - Props do componente
 * @param {ReactNode} props.children - Elemento trigger que abre o diálogo
 * @param {Function} props.handleCloseClick - Callback executado ao confirmar logout
 * @returns {JSX.Element} Diálogo de confirmação de saída
 * 
 * @example
 * <SairDialog handleCloseClick={handleLogout}>
 *   <Button variant="destructive">
 *     <LogOutIcon />
 *     Sair
 *   </Button>
 * </SairDialog>
 */
export const SairDialog = ({ children, handleCloseClick }: SairDialogProps) => {
    return (
        <Dialog.Container>
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>

            <Dialog.Content>
                <Dialog.Title>Sair</Dialog.Title>

                <Separator/>

                <Dialog.Description>Tem certeza de que deseja sair da sua sessão atual?</Dialog.Description>

                <Dialog.Footer className="flex flex-row-reverse">
                    <Dialog.Close asChild>
                        <Button variant="destructive" onClick={handleCloseClick}>
                            <LogOutIcon/>
                            Sair
                        </Button>
                    </Dialog.Close>

                    <Dialog.Close asChild>
                        <Button variant="outline">
                            <ArrowLeftIcon/>
                            Voltar
                        </Button>
                    </Dialog.Close>
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog.Container>
    )
}