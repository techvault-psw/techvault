"use client"


import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { ReactNode } from "react"

interface DatePickerProps {
  open: boolean
  setOpen: (open: boolean) => void
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  children: ReactNode
}

export function DatePicker({ open, setOpen, date, setDate, children }: DatePickerProps) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={(date) => {
            setDate(date)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
