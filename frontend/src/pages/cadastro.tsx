import { Link, useNavigate } from "react-router";

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
import { Input, Label } from "@/components/ui/input";
import InputPassword from '@/components/ui/input-password';
import { Button } from '../components/ui/button';
import { Separator } from "@/components/ui/separator";
import { useHookFormMask } from 'use-mask-input';

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório").regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido. Use: (XX) XXXXX-XXXX"),
  email: z.string().min(1, "O e-mail é obrigatório").email("Digite um e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória")
})

export default function CadastroPage() {
  const navigate = useNavigate();

  const form2 = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: ""
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    navigate("/")
  }

  const registerWithMask = useHookFormMask(form2.register)

  return (
    <PageContainer.Auth>
      <PageTitle className="text-center">Cadastro</PageTitle>

      <Separator/>

      <Form {...form2}>
        <form onSubmit={form2.handleSubmit(onSubmit)} className="space-y-6 max-w-sm" noValidate>
          <FormField
            control={form2.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                    <Input placeholder="José da Silva" type="text" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
          />

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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    {...registerWithMask("phone", ['(99) 99999-9999'], {
                      required: true
                    })}
                    placeholder="(__) _____-____"
                    type="tel"
                  />
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
            Cadastrar
          </Button>
        </form>
      </Form>

      <p className="text-base text-center">
        Já possui uma conta? <Link to="/login" className="font-semibold underline">Entrar</Link>
      </p>
    </PageContainer.Auth>
  );
}