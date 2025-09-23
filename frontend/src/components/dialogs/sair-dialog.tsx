import type { ReactNode } from "react"
import { Dialog } from "../ui/dialog"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { ArrowLeftIcon } from "../icons/arrow-left-icon"
import { LogOutIcon } from "lucide-react"

interface SairDialogProps {
    children: ReactNode,
    handleCloseClick: () => void
}

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