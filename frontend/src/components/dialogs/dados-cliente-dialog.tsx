import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input, Label } from "@/components/ui/input";
import { clientes, type Cliente } from "@/consts/clientes";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, type MouseEvent, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from 'react-router';
import { useHookFormMask } from 'use-mask-input';
import * as z from "zod";
import { Button } from "../ui/button";
import { Card } from '../ui/card';
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { TrashIcon } from '../icons/trash-icon';
import { ExcluirClienteDialog } from './excluir-cliente-dialog';
import useCargo from '@/hooks/useCargo';
import { useDispatch } from 'react-redux';
import { updateCliente } from '@/redux/clientes/slice';

interface DadosClienteDialogProps {
  cliente: Cliente;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  fromReservaId?: number;
}

const formSchema = z.object({
  name: z.string().min(1, "O cliente deve possuir um nome"),
  email: z.string().min(1, "O cliente deve possuir um e-mail").email("Digite um e-mail válido"),
  phone: z.string()
    .min(1, "O cliente deve possuir um telefone")
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido. Use: (XX) XXXXX-XXXX")
})

export const DadosClienteDialog = ({ cliente, children, open: controlledOpen, onOpenChange, fromReservaId }: DadosClienteDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const [isEditting, setIsEditting] = useState(false)

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const location = useLocation()
  const { isGerente } = useCargo()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: cliente.name,
      email: cliente.email,
      phone: cliente.phone,
    },
  })

  function handleEditClick(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsEditting(true)
  }

  const dispatch = useDispatch();
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsEditting(false)
    dispatch(updateCliente({
      ...cliente,
      ...values
    }));
  }

  const registerWithMask = useHookFormMask(form.register)

  const handleOpenChange = (open: boolean) => {
    if (!isControlled) {
      setInternalOpen(open);
    }
    onOpenChange?.(open);
  };

  return (
    <Dialog.Container open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Dados do Cliente</Dialog.Title>

        <Separator />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!isEditting}
                      placeholder="Nome do cliente"
                      type="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!isEditting}
                      placeholder="E-mail do cliente"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
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
                      disabled={!isEditting}
                      placeholder="(__) _____-____"
                      type="tel"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <Label htmlFor="registration-date">Data de Cadastro</Label>
              <Input
                disabled
                id="registration-date"
                type="text"
                value={cliente.registrationDate}
              />
            </FormItem>

            <div className="flex flex-col gap-3">
              {isEditting ? (
                <Button type="submit" className='min-h-[2.625rem]'>
                  Salvar alterações
                </Button>
              ) : isGerente() && (
                <Button type="button" onClick={handleEditClick} variant="outline">
                  Editar informações
                </Button>
              )}

              <Link 
                to={`/reservas-cliente/${cliente.id % clientes.length}`} 
                state={{ 
                  fromClientDialog: cliente.id,
                  returnTo: location.pathname,
                  fromReservaId
                }}
              >
                <Card.Container>
                  <Card.Title>Ver Reservas</Card.Title>
                </Card.Container>
              </Link>

              <Link 
                to={`/enderecos-cliente/${cliente.id % clientes.length}`} 
                state={{ 
                  fromClientDialog: cliente.id,
                  returnTo: location.pathname,
                  fromReservaId
                }}
              >
                <Card.Container>
                  <Card.Title>Ver Endereços</Card.Title>
                </Card.Container>
              </Link>

              { isGerente() && 
                <ExcluirClienteDialog cliente={cliente} setIsClientDialogOpen={(open) => handleOpenChange(open)}>
                  <Button variant="destructive">
                    <TrashIcon className="size-5" />
                    Excluir
                  </Button>
                </ExcluirClienteDialog>
              }
            </div>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog.Container>
  );
};