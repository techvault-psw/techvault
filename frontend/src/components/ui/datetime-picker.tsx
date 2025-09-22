import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "../icons/calendar-icon";
import { Separator } from "./separator";

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "MM/DD/YYYY HH:mm",
  className,
  disabled = false,
  "aria-invalid": ariaInvalid,
}: DateTimePickerProps) {
  function handleDateSelect(date: Date | undefined) {
    if (date) {
      if (value) {
        const newDate = new Date(date);
        newDate.setHours(value.getHours());
        newDate.setMinutes(value.getMinutes());
        onChange(newDate);
      } else {
        onChange(date);
      }
    }
  }

  function handleTimeChange(type: "hour" | "minute", timeValue: string) {
    const currentDate = value || new Date();
    let newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(timeValue, 10);
      newDate.setHours(hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(timeValue, 10));
    }

    onChange(newDate);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            `file:text-white placeholder:text-gray/50 selection:bg-primary selection:text-primary-foreground
              flex items-center justify-between leading-none w-full px-3 py-2 bg-gray/5 backdrop-blur-sm
              rounded-lg border border-gray/50 text-base shadow-xs transition-[color,box-shadow] outline-none
              cursor-pointer disabled:cursor-not-allowed focus-visible:border-white focus-visible:ring-white focus-visible:ring-[1px]
              aria-invalid:ring-red/40 aria-invalid:border-red`,
            !value && "text-gray/50",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          aria-invalid={ariaInvalid}
        >
          {value ? (
            format(value, "dd/MM/yyyy HH:mm")
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className="size-5 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            initialFocus
            disabled={disabled}
          />

          <Separator className="sm:hidden bg-gray/20" />

          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x mt-2">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2 pt-0">
                {Array.from({ length: 24 }, (_, i) => i)
                  .reverse()
                  .map((hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={
                        value && value.getHours() === hour
                          ? "secondary"
                          : "ghost"
                      }
                      className="sm:w-full shrink-0 aspect-square border-0 leading-none"
                      onClick={() =>
                        handleTimeChange("hour", hour.toString())
                      }
                      disabled={disabled}
                    >
                      {hour}
                    </Button>
                  ))}
              </div>
              <ScrollBar
                orientation="horizontal"
                className="sm:hidden"
              />
            </ScrollArea>

            <Separator className="sm:hidden bg-gray/20" />
            <Separator className="hidden sm:block bg-gray/20" orientation="vertical" />

            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2 pt-0">
                {Array.from({ length: 12 }, (_, i) => i * 5).map(
                  (minute) => (
                    <Button
                      key={minute}
                      size="icon"
                      variant={
                        value &&
                        value.getMinutes() === minute
                          ? "secondary"
                          : "ghost"
                      }
                      className="sm:w-full shrink-0 aspect-square border-0 leading-none"
                      onClick={() =>
                        handleTimeChange("minute", minute.toString())
                      }
                      disabled={disabled}
                    >
                      {minute.toString().padStart(2, "0")}
                    </Button>
                  )
                )}
              </div>
              <ScrollBar
                orientation="horizontal"
                className="sm:hidden"
              />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}