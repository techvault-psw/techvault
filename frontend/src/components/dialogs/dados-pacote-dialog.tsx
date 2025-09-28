import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useRef, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Upload, Pen, Trash2, ArrowLeft } from "lucide-react";

import { currencyMask } from "@/lib/currency-input-mask";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { cn } from '@/lib/utils';
import { ExcluirPacoteDialog } from './excluir-pacote-dialog';
import useCargo from '@/hooks/useCargo';
import { deletePackage, type Pacote } from '@/redux/pacotes/slice';
import { useDispatch } from 'react-redux';
import { updatePackage } from '@/redux/pacotes/slice';

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string()
    .min(1, "A descrição é obrigatória")
    .refine(
      (value) => value.trim().length >= 10,
      { message: "A descrição deve ter pelo menos 10 caracteres" }
    ),
  components: z.string()
    .min(1, "Os componentes são obrigatórios"),
  value: z.string()
    .min(1, "O valor é obrigatório")
    .refine(
      (value) => currencyMask.isValidCurrency(value),
      { message: "O valor deve ser maior que zero" }
    ),
  image: z.instanceof(File, { message: "A imagem é obrigatória" }).optional()
});

interface DadosPacoteDialogProps {
  pacote: Pacote;
  children: ReactNode;
}

export const DadosPacoteDialog = ({ pacote, children }: DadosPacoteDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditting, setIsEditting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(pacote.image);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isGerente } = useCargo()
  const dispatch = useDispatch()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: pacote.name,
      description: pacote.description.join('\n\n'),
      components: pacote.components.join('\n'),
      value: currencyMask.formatCurrency((pacote.value * 100).toString()),
      image: undefined
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedPacote: Pacote = {
      ...pacote,
      name: values.name,
      description: values.description.split('\n\n').filter(desc => desc.trim()),
      components: values.components.split('\n').filter(comp => comp.trim()),
      value: currencyMask.parseCurrency(values.value),
      image: previewUrl || pacote.image,
    };
    
    dispatch(updatePackage(updatedPacote))
    setIsEditting(false)
  }

  const handleValueChange = (value: string, onChange: (value: string) => void) => {
    const formattedValue = currencyMask.formatCurrency(value);
    onChange(formattedValue);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, onChange: (file: File | undefined) => void) => {
    const file = event.target.files?.[0];
    
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onChange(file);
    } else {
      setPreviewUrl(pacote.image);
      onChange(undefined);
    }
  };

  const handleUploadClick = () => {
    if (isEditting) {
      fileInputRef.current?.click();
    }
  };

  const cleanupPreview = () => {
    if (previewUrl && previewUrl !== pacote.image) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(pacote.image);
  };

  const resetForm = () => {
    form.reset({
      name: pacote.name,
      description: pacote.description.join('\n\n'),
      components: pacote.components.join('\n'),
      value: currencyMask.formatCurrency((pacote.value * 100).toString()),
      image: undefined
    });
    setPreviewUrl(pacote.image);
  };

  const handleDeleteClick = () => {
    dispatch(deletePackage(pacote.id))
    setIsOpen(false)
  }

  return (
    <Dialog.Container open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        cleanupPreview();
        setIsEditting(false);
        resetForm();
      }
    }}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content className='min-[540px]:max-w-xl max-h-9/10'>
        <Dialog.Title className="text-xl font-bold">Informações do Pacote</Dialog.Title>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 overflow-y-hidden" noValidate>
            <div className='flex flex-col gap-5 custom-scrollbar-ver'>
              <FormField
                control={form.control}
                name="image"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Foto</FormLabel>
                    <FormControl>
                      <FormItem>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, field.onChange)}
                          className="hidden"
                          disabled={!isEditting}
                        />
                        <div
                          onClick={handleUploadClick}
                          className={cn(
                            `w-2/3 aspect-[1.6] rounded-lg bg-black border flex items-center justify-center overflow-hidden transition-colors`,
                            isEditting ? 'cursor-pointer' : 'cursor-default',
                            fieldState.error
                              ? 'border-red' 
                              : 'border-gray/80'
                          )}
                        >
                          {previewUrl ? (
                            <img 
                              src={previewUrl} 
                              alt="Preview" 
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <Upload className="size-10 text-gray" />
                          )}
                        </div>
                      </FormItem>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-[2fr_1fr] gap-3'>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Nome do Pacote"
                          disabled={!isEditting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (hora)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="R$ 0,00"
                          disabled={!isEditting}
                          value={field.value}
                          onChange={(e) => handleValueChange(e.target.value, field.onChange)}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o pacote..."
                        disabled={!isEditting}
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="components"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Componentes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Liste os componentes (um por linha)..."
                        disabled={!isEditting}
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isGerente() && (
              <Dialog.Footer className="block space-y-3">
                {isEditting ? (
                  <Button type="submit" className="h-[2.625rem] w-full">
                    Salvar alterações
                  </Button>
                ) : (
                  <div className="w-full flex gap-3 items-center">
                    <ExcluirPacoteDialog pacote={pacote} handleDeleteClick={handleDeleteClick}>
                      <Button variant="destructive">
                        <Trash2 className="size-4"/>
                        Excluir
                      </Button>
                    </ExcluirPacoteDialog>

                    <Button variant="outline" onClick={() => setIsEditting(true)}>
                      <Pen className="size-4" />
                      Editar
                    </Button>
                  </div>
                )}

                <Dialog.Close asChild>
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="size-4"/>
                    Voltar
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            )}
          </form>
        </Form>
      </Dialog.Content>
    </Dialog.Container>
  )
}