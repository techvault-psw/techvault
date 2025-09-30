import { cn } from "@/lib/utils";
import type { Pacote } from "@/redux/pacotes/slice";
import type { ComponentProps } from "react";

interface PacoteImageProps extends ComponentProps<'div'> {
  pacote: Pacote
}

export const PacoteImage = ({ pacote, className, ...props }: PacoteImageProps) => {
  const imageUrl = pacote.image.startsWith("blob") ? pacote.image : `/${pacote.image}`

  return (
    <div className={cn("aspect-[1.6] rounded-xl overflow-hidden border border-gray/20 flex-shrink-0", className)} {...props}>
      <img src={imageUrl} className="size-full object-cover" />
    </div>
  );
}
