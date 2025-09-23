import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        `border-gray/50 placeholder:text-gray/50
          focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[2px]
          aria-invalid:ring-red/40 aria-invalid:border-red
          flex field-sizing-content min-h-28 max-h-52 w-full rounded-lg shadow-xs
          border bg-gray/5 backdrop-blur-sm px-3 py-2 text-base leading-[130%]
          transition-[color,box-shadow] outline-none
          disabled:cursor-not-allowed
        `,
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
