import { ArrowLeftIcon } from "lucide-react";
import { type ReactNode } from "react";
import { TrashIcon } from "../icons/trash-icon";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import z from "zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import InputPassword from "../ui/input-password";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/root-reducer";
import { zodResolver } from "@hookform/resolvers/zod";
import { HighlightBox } from "../highlight-box";
import bcryptjs from 'bcryptjs'

interface ExcluirContaDialogProps {
  children: ReactNode
  handleDeleteClick: () => void
}

const formSchema = z
  .object({
    password: z.string()
      .min(1, "A senha é obrigatória")
})

export const ExcluirContaDialog = ({ children, handleDeleteClick }: ExcluirContaDialogProps) => {
  const { clienteAtual } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if(!clienteAtual) return

    const passwordMatch = await bcryptjs.compare(values.password, clienteAtual.password)
    if (passwordMatch) {
      handleDeleteClick()
    } else {
      form.setError("password", { 
          message: "Senha incorreta" 
      })
    }
  }

  return (
    <Dialog.Container>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Excluir Conta</Dialog.Title>

        <Separator />

        <HighlightBox variant="destructive">
          A exclusão da sua conta é uma <strong>ação irreversível</strong> e vai acarretar na perda de: <br/>
          • Todos os seus dados cadastrais; <br/>
          • Todos os seus endereços; <br/>
          • Todo seu histórico de reservas; <br/>
          • Todos os seus feedbacks. <br/>
        </HighlightBox>
    
        <Dialog.Description>
          Para confirmar esta operação, digite sua senha:
        </Dialog.Description>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <InputPassword {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
          />

          <Dialog.Footer>
            <Dialog.Close asChild>
              <Button type="button" variant="outline">
                <ArrowLeftIcon className="size-5" />
                Voltar
              </Button>
            </Dialog.Close>
            <Button variant="destructive">
              <TrashIcon className="size-5" />
              Excluir
            </Button>
          </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog.Container>
  );
};
