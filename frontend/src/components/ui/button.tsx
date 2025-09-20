import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  ` inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-lg transition-all duration-200 cursor-pointer
    disabled:pointer-events-none disabled:opacity-50
    [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0
    outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
    aria-invalid:ring-red/20 dark:aria-invalid:ring-red/40 aria-invalid:border-red
  `,
  {
    variants: {
      variant: {
        default: "bg-linear-(--gradient-primary-b) text-white hover:brightness-109",
        destructive:
          "bg-red/10 text-red hover:bg-red/15 focus-visible:border-red focus-visible:ring-red/20 border-2 border-red",
        outline:
          "bg-gray/10 text-white hover:bg-gray/15 focus-visible:border-white border-2 border-white",
        secondary:
          "bg-white hover:bg-zinc-200 text-black",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "text-lg font-medium gap-2 px-3 py-2.5 has-[>svg]:px-3 leading-none",
        sm: "text-lg font-medium gap-1 px-2 py-1 has-[>svg]:px-2.5 leading-none",
        lg: "text-xl font-semibold gap-2 px-6 has-[>svg]:px-4 leading-none",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
