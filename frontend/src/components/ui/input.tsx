import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        `file:text-white placeholder:text-gray selection:bg-primary selection:text-primary-foreground
          flex items-center justify-between leading-none w-full px-3 py-2 bg-gray/5 backdrop-blur-sm
          rounded-lg border border-gray/50 text-base shadow-xs transition-[color,box-shadow] outline-none
          file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium
          disabled:cursor-not-allowed md:text-sm
          focus-visible:border-white focus-visible:ring-white focus-visible:ring-[1px]
          aria-invalid:ring-red/20 dark:aria-invalid:ring-red/40 aria-invalid:border-red
        `,
        className
      )}
      {...props}
    />
  )
}

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-base leading-none text-gray font-medium select-none",
        className
      )}
      {...props}
    />
  )
}

export { Input, Label }
