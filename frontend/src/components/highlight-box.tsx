import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface HighlightBoxProps extends ComponentProps<'div'> {}

export const HighlightBox = ({ className, children, ...props }: HighlightBoxProps) => {
  return (
    <div
      className={cn(`
        w-full py-2 md:p-0 flex items-center justify-center 
        bg-gray/10 border border-gray/10 rounded-lg
        text-white font-semibold text-xl
      `, className)}
      {...props}
    >
      {children}
    </div>
  );
}
