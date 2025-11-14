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
import { Input } from "@/components/ui/input";
import InputPassword from '@/components/ui/input-password';
import { Button } from '../components/ui/button';
import { Separator } from "@/components/ui/separator";
import useCargo from "@/hooks/useCargo";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/root-reducer";
import { selectAllClientes, type Role } from "@/redux/clientes/slice";
import { useEffect, useState } from "react";
import { fetchClientes, loginServer } from "@/redux/clientes/fetch";
import type { AppDispatch } from "@/redux/store";
import { HighlightBox } from "@/components/highlight-box";
import { jwtDecode } from "jwt-decode";

const formSchema = z.object({
  email: z.string().min(1, "O e-mail é obrigatório").email("Digite um e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória")
})

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [error, setError] = useState(false);

  const form2 = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    const { email, password } = values

    try {
      const result = await dispatch(loginServer({ email, password })).unwrap()

      setError(false)
      const { id } = jwtDecode<{ id: string; role: Role }>(result.token)
      const cliente = clientes.find(c => c.id === id)

      if (!cliente) return

      if (redirectTo) {
        navigate(redirectTo, { replace: true })
      } else if (cliente.role === "Gerente" || cliente.role === "Suporte") {
        navigate("/dashboard", { replace: true })
      } else {
        navigate("/", { replace: true })
      }
    } catch (error: any) {
      if (error?.status === 401) {
        setError(false)
        
        form2.setError("email", {
          type: "custom",
          message: "E-mail ou Senha inválidos"
        })

        form2.setError("password", {
          type: "custom",
          message: "E-mail ou Senha inválidos"
        })
      } else {
        setError(true)
      }
    }
  }

  return (
    <PageContainer.Auth>
      <PageTitle className="text-center">Login</PageTitle>

      <Separator/>

      {(statusC === 'failed' || error) && (
        <HighlightBox variant="destructive">
          Estamos enfrentando um problema, tente novamente mais tarde.
        </HighlightBox>
      )}

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

      <p className="text-base text-center">
        Não possui uma conta? <Link to={redirectTo ? `/cadastro?redirectTo=${redirectTo}` : "/cadastro"} className="font-semibold underline">Cadastrar-se</Link>
      </p>
    </PageContainer.Auth>
  );
}