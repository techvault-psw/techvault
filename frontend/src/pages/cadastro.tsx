/**
 * @fileoverview Página de cadastro de novos usuários
 * 
 * Esta página permite que novos usuários se cadastrem no sistema fornecendo
 * informações pessoais (nome, telefone, e-mail e senha). Após cadastro bem-sucedido,
 * o usuário é automaticamente autenticado e redirecionado.
 * 
 * @module pages/CadastroPage
 */

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
import { selectAllClientes, type NewCliente, type Role } from "@/redux/clientes/slice";
import type { RootState } from "@/redux/root-reducer";
import { addClienteServer, fetchClientes, loginServer } from "@/redux/clientes/fetch";
import { useEffect, useState } from "react";
import type { AppDispatch } from "@/redux/store";
import { HighlightBox } from "@/components/highlight-box";
import { jwtDecode } from "jwt-decode";

/**
 * Schema de validação para o formulário de cadastro
 * 
 * @constant
 * @type {z.ZodObject}
 * @property {string} name - Nome completo do usuário (obrigatório)
 * @property {string} phone - Telefone no formato (XX) XXXXX-XXXX
 * @property {string} email - E-mail do usuário (obrigatório e deve ser válido)
 * @property {string} password - Senha do usuário (obrigatório)
 */
const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório").regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido. Use: (XX) XXXXX-XXXX"),
  email: z.string().min(1, "O e-mail é obrigatório").email("Digite um e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória")
})

/**
 * Componente da página de cadastro
 * 
 * Permite ao usuário:
 * - Criar uma nova conta fornecendo nome, e-mail, telefone e senha
 * - Ser redirecionado automaticamente após cadastro (via parâmetro redirectTo)
 * - Validar unicidade de e-mail e telefone
 * - Acessar a página de login se já tiver uma conta
 * 
 * O novo usuário é criado com cargo "Cliente" e após o cadastro é automaticamente
 * autenticado no sistema. O redirecionamento segue as mesmas regras da página de login.
 * 
 * @component
 * @returns {JSX.Element} Página de cadastro
 * 
 * @example
 * // Uso no roteamento
 * <Route path="/cadastro" element={<CadastroPage />} />
 * 
 * @example
 * // Com redirecionamento após cadastro
 * <Link to="/cadastro?redirectTo=/pacotes-disponiveis">Cadastre-se</Link>
 */
export default function CadastroPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [error, setError] = useState(false);
  
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
  
  /**
   * Manipula o envio do formulário de cadastro
   * 
   * Valida se e-mail e telefone não estão em uso, cria novo cliente no servidor,
   * faz login automático e redireciona para página apropriada.
   * 
   * @param {Object} values - Valores do formulário validados pelo Zod
   * @param {string} values.name - Nome completo do usuário
   * @param {string} values.email - E-mail do usuário
   * @param {string} values.phone - Telefone do usuário
   * @param {string} values.password - Senha do usuário
   * @returns {Promise<void>}
   */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const novoCliente: NewCliente = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      password: values.password,
      registrationDate: new Date().toLocaleDateString("pt-BR"),
      role: "Cliente"
    };

    if(clientes.find(cliente => cliente.email === values.email)){
      form2.setError("email", {type:"custom", message: "Este e-mail já está sendo usado"});
      return;
    }

    if(clientes.find(cliente => cliente.phone === values.phone)){
      form2.setError("phone", {type:"custom", message: "Este telefone já está sendo usado"});
      return;
    }

    try {
      await dispatch(addClienteServer(novoCliente)).unwrap()
      const result = await dispatch(loginServer({ email: values.email, password: values.password })).unwrap()
      
      setError(false)
      const { id } = jwtDecode<{ id: string; role: Role }>(result.token)
      const cliente = clientes.find(c => c.id === id)

      if (redirectTo) {
        navigate(redirectTo, { replace: true })
      } else if (cliente?.role === "Gerente" || cliente?.role === "Suporte") {
        navigate("/dashboard", { replace: true })
      } else {
        navigate("/", { replace: true })
      }
    } catch (err) {
      setError(true)
    }
  }

  const registerWithMask = useHookFormMask(form2.register)

  return (
    <PageContainer.Auth>
      <PageTitle className="text-center">Cadastro</PageTitle>

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