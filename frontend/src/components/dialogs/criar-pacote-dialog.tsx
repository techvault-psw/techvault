import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useRef, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Upload } from "lucide-react";

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
import { useDispatch } from 'react-redux';
import { addPacoteServer } from '@/redux/pacotes/fetch';
import type { AppDispatch } from '@/redux/store';
import { uploadPacoteImage } from '@/lib/upload-pacote-image';

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
  quantity: z.string()
    .min(1, "A quantidade é obrigatória")
    .refine(
      (value) => {
        const num = parseFloat(value);
        return !isNaN(num) && num >= 0 && Number.isInteger(num);
      },
      { message: "A quantidade deve ser um número inteiro não negativo" }
    ),
  image: z.instanceof(File, { message: "A imagem é obrigatória" })
});

interface CriarPacoteDialogProps {
  children: ReactNode
}

export const CriarPacoteDialog = ({ children }: CriarPacoteDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      components: "",
      value: "",
      quantity: "",
      image: undefined
    },
  });

  const dispatch = useDispatch<AppDispatch>()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!previewUrl) return

    const { url } = await uploadPacoteImage(previewUrl)

    if (!url) return
    
    dispatch(addPacoteServer({
      ...values,
      image: url,
      value: currencyMask.parseCurrency(values.value),
      quantity: parseInt(values.quantity),
      description: values.description.split('\n\n').filter(desc => desc.trim()),
      components: values.components.split('\n').filter(comp => comp.trim()),
    }))
    
    setIsOpen(false)
    form.reset()
    setPreviewUrl(null)
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
      setPreviewUrl(null);
      onChange(undefined);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const cleanupPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleQuantityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const blockedKeys = ['-', '+', 'e', 'E', '.', ','];
    
    if (blockedKeys.includes(e.key)) {
      e.preventDefault()
    }
  }

  const handleQuantityPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedValue = e.clipboardData.getData('text');
    
    if (!/^\d+$/.test(pastedValue)) {
      e.preventDefault();
    }
  }

  return (
    <Dialog.Container open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        form.reset();
        cleanupPreview();
      }
    }}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Criar Pacote</Dialog.Title>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 overflow-y-hidden" noValidate>
            <div className='flex flex-col gap-5 custom-scrollbar-ver'>
              <div className='grid grid-cols-[2fr_1fr] gap-3'>
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
                          />
                          <div
                            onClick={handleUploadClick}
                            className={cn(
                            `w-full aspect-[1.6] rounded-lg bg-black border flex items-center justify-center overflow-hidden transition-colors cursor-pointer`,
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

                <div className='flex flex-col gap-6 items-center'>
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

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            onKeyDown={handleQuantityKeyDown}
                            onPaste={handleQuantityPaste}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o pacote..."
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
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Dialog.Footer>
              <Dialog.Close asChild>    
                <Button variant="outline" type="button"> 
                  Cancelar
                </Button>
              </Dialog.Close>

              <Button type="submit" className="h-[2.625rem]">
                Criar
              </Button>
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog.Container>
  )
}