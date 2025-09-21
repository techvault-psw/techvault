import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  `rounded-xl py-1 px-3`,
  {
    variants: {
      variant: {
        green: "bg-green-600",
        red: "bg-red-500",
        "dark-red": "bg-red-800",
        purple: "bg-purple-600",
        blue: "bg-blue-600",
      },
    },
    defaultVariants: {
      variant: "green",
    },
  }
)

function Badge({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge, badgeVariants }

