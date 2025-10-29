import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const highlightBoxVariants = cva(
  `border`,
  {
    variants: {
      variant: {
        default: `
          w-full py-2 flex items-center justify-center 
          bg-gray/10 border-gray/10 rounded-lg
          text-white font-semibold text-xl
        `,
        destructive:
          "px-4 py-3 rounded-xl bg-red/10 border-red text-red text-left",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function HighlightBox({
  className,
  variant,
  children,
  ...props
}: ComponentProps<'div'> & VariantProps<typeof highlightBoxVariants>) {
  return (
    <div
      className={cn(highlightBoxVariants({ variant, className }))}
      {...props}
    >
      {children}
    </div>
  )
}

export { HighlightBox, highlightBoxVariants }
