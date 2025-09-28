import { cn } from "@/lib/utils";
import type { Pacote } from "@/redux/pacotes/slice";
import type { ComponentProps } from "react";

interface PacoteImageProps extends ComponentProps<'div'> {
  pacote: Pacote
}

export const PacoteImage = ({ pacote, className, ...props }: PacoteImageProps) => {
  return (
    <div className={cn("aspect-[1.6] rounded-xl overflow-hidden border border-gray/20 flex-shrink-0", className)} {...props}>
      <img src={`${pacote.image}`} className="size-full object-cover" />
    </div>
  );
}
