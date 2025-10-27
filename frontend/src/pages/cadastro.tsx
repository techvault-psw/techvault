import { Link, useNavigate, useSearchParams } from "react-router";

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

import { useDispatch, useSelector } from "react-redux";
import { loginCliente, selectAllClientes, type NewCliente } from "@/redux/clientes/slice";
import type { Cliente } from "@/consts/clientes";
import type { RootState } from "@/redux/root-reducer";
import { addClienteServer, fetchClientes } from "@/redux/clientes/fetch";
import { useEffect } from "react";
import type { AppDispatch } from "@/redux/store";
import { HighlightBox } from "@/components/highlight-box";


const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório").regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido. Use: (XX) XXXXX-XXXX"),
  email: z.string().min(1, "O e-mail é obrigatório").email("Digite um e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória")
})

export default function CadastroPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const form2 = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: ""
    },
  })

    const dispatch = useDispatch<AppDispatch>()
    const { status: statusC, error: errorC } = useSelector((rootReducer: RootState) => rootReducer.clienteReducer)
  
    useEffect(() => {
        if (['not_loaded', 'saved', 'deleted'].includes(statusC)) {
            dispatch(fetchClientes())
        }
    }, [statusC, dispatch])
    const clientes = useSelector(selectAllClientes)
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const novoCliente: NewCliente = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      password: values.password,
      registrationDate: new Date().toLocaleDateString("pt-BR"), // data atual
      role: "Cliente"
    };

    if(clientes.find(cliente => cliente.email === values.email)){
      form2.setError("email", {type:"custom", message: "Este e-mail já está sendo usado"});
      return;
    }

    await dispatch(addClienteServer(novoCliente))
    await dispatch(loginCliente(values));
    if (redirectTo) {
      navigate(redirectTo, { replace: true })
    } else {
      navigate("/");
    }

  }

  const registerWithMask = useHookFormMask(form2.register)

  return (
    <PageContainer.Auth>
      <PageTitle className="text-center">Cadastro</PageTitle>

      <Separator/>

      {statusC === 'failed' && (
        <HighlightBox variant="destructive">
          Estamos enfrentando um problema, tente novamente mais tarde.
        </HighlightBox>
      )}

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
        Já possui uma conta? <Link to={redirectTo ? `/login?redirectTo=${redirectTo}` : "/login"} className="font-semibold underline">Entrar</Link>
      </p>
    </PageContainer.Auth>
  );
}