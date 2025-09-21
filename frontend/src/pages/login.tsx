import { Link } from "react-router";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

import { PageContainer } from "@/components/page-container";
import { PageTitle } from "@/components/page-title";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '../components/ui/form';
import { Input } from "@/components/ui/input";
import InputPassword from '@/components/ui/input-password';
import { Button } from '../components/ui/button';
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  email: z.string().min(1, "O e-mail é obrigatório").email("Digite um e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória")
})

export default function LoginPage() {
  const form2 = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <PageContainer.Auth>
      <PageTitle className="text-center">Login</PageTitle>

      <Separator/>

      <Form {...form2}>
        <form onSubmit={form2.handleSubmit(onSubmit)} className="space-y-6 max-w-sm" noValidate>
          <FormField
            control={form2.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="seu@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form2.control}
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

          <Button type="submit" size="lg" className="w-full">
            Entrar
          </Button>
        </form>
      </Form>

      <p className="text-sm text-center">
        Não possui uma conta? <Link to="/cadastro" className="font-semibold underline">Cadastrar-se</Link>
      </p>
    </PageContainer.Auth>
  );
}