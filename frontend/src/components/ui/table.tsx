import * as React from "react"

import { cn } from "@/lib/utils"

function TableContainer({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
    >
      <table
        data-slot="table"
        className={cn("w-full text-base", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b [&_tr]:border-gray-2/50 [&_tr]:bg-background/80", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("", className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "bg-slate-950/80 hover:brightness-100 hover:bg-slate-900 border-b border-gray-2/20 cursor-pointer transition-colors duration-200",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-left py-3 px-4 text-white font-semibold",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "py-3 px-4 text-gray font-light",
        className
      )}
      {...props}
    />
  )
}

export const Table = {
  Container: TableContainer,
  Header: TableHeader,
  Body: TableBody,
  Head: TableHead,
  Row: TableRow,
  Cell: TableCell,
}
