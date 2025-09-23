import * as React from "react"

import { cn } from "@/lib/utils"
import { ArrowRightIcon } from "../icons/arrow-right-icon"

function CardContainer({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        `w-full p-3 flex items-center justify-between gap-2 bg-white/5 hover:bg-white/10
         border border-gray/50 rounded-lg backdrop-blur-sm cursor-pointer transition-colors duration-200
         not-has-[div[data-slot=card-description]:not(.hidden)]:py-2
        `,
        className
      )}
      {...props}
    >
      {children}

      <button className="size-6 cursor-pointer flex-shrink-0">
        <ArrowRightIcon className="size-full" />
      </button>
    </div>
  )
}

function CardTextContainer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-text-container"
      className={cn("flex flex-col gap-2 h-full", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-semibold text-lg leading-none", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-base text-gray font-light", className)}
      {...props}
    />
  )
}

export const Card = {
  Container: CardContainer,
  TextContainer: CardTextContainer,
  Title: CardTitle,
  Description: CardDescription,
}
