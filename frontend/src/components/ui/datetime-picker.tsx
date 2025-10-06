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
  minuteStep?: number;
  disablePast?: boolean;
  minHoursFromNow?: number;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "MM/DD/YYYY HH:mm",
  className,
  disabled = false,
  "aria-invalid": ariaInvalid,
  minuteStep = 1,
  disablePast = false,
  minHoursFromNow = 0,
}: DateTimePickerProps) {
  const now = new Date();
  const minDate = new Date(now.getTime() + minHoursFromNow * 60 * 60 * 1000);

  function roundMinutesToStep(minutes: number): number {
    return Math.ceil(minutes / minuteStep) * minuteStep;
  }

  function getValidInitialTime(date: Date): Date {
    const newDate = new Date(date);
    
    if (!disablePast && minHoursFromNow === 0) {
      newDate.setHours(12, 0, 0, 0);
      return newDate;
    }

    if (newDate < minDate) {
      const roundedMinutes = roundMinutesToStep(minDate.getMinutes());
      const adjustedDate = new Date(minDate);
      
      if (roundedMinutes >= 60) {
        adjustedDate.setHours(minDate.getHours() + 1);
        adjustedDate.setMinutes(0, 0, 0);
      } else {
        adjustedDate.setMinutes(roundedMinutes, 0, 0);
      }
      
      return adjustedDate;
    }

    if (
      newDate.getDate() === minDate.getDate() &&
      newDate.getMonth() === minDate.getMonth() &&
      newDate.getFullYear() === minDate.getFullYear()
    ) {
      const roundedMinutes = roundMinutesToStep(minDate.getMinutes());
      
      if (roundedMinutes >= 60) {
        newDate.setHours(minDate.getHours() + 1);
        newDate.setMinutes(0, 0, 0);
      } else {
        newDate.setHours(minDate.getHours());
        newDate.setMinutes(roundedMinutes, 0, 0);
      }
      
      return newDate;
    }

    // Caso contrário, usa meio-dia
    newDate.setHours(12, 0, 0, 0);
    return newDate;
  }

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      if (value) {
        const newDate = new Date(date);
        newDate.setHours(value.getHours());
        newDate.setMinutes(value.getMinutes());
        
        if (newDate < minDate) {
          onChange(getValidInitialTime(date));
        } else {
          onChange(newDate);
        }
      } else {
        onChange(getValidInitialTime(date));
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

  function isTimeDisabled(hour: number, minute?: number): boolean {
    if (!value) return false;

    const selectedDate = new Date(value);
    selectedDate.setHours(hour);
    
    if (minute !== undefined) {
      selectedDate.setMinutes(minute);
    } else {
      selectedDate.setMinutes(0);
    }

    return selectedDate < minDate;
  }

  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  const minutes = Array.from(
    { length: Math.floor(60 / minuteStep) }, 
    (_, i) => i * minuteStep
  );

  return (
    <Popover open={disabled ? false : undefined}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            `file:text-white placeholder:text-gray/50 selection:bg-primary selection:text-primary-foreground
              flex items-center justify-between leading-none w-full px-3 py-2 bg-gray/5 backdrop-blur-sm
              rounded-lg border border-gray/50 text-base shadow-xs transition-[color,box-shadow] outline-none
              cursor-pointer disabled:cursor-not-allowed focus-visible:border-white focus-visible:ring-white focus-visible:ring-[1px]
              aria-invalid:ring-red/40 aria-invalid:border-red`,
            !disabled && "hover:bg-gray/10",
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
            disabled={
              disabled
                ? true
                : (date) => {
                    const dateOnly = new Date(date);
                    dateOnly.setHours(0, 0, 0, 0);
                    const minDateOnly = new Date(minDate);
                    minDateOnly.setHours(0, 0, 0, 0);
                    return dateOnly < minDateOnly;
                  }
            }
          />

          <Separator className="sm:hidden bg-gray/20" />
          <Separator className="hidden sm:block bg-gray/20 sm:!h-[300px] mt-2 mr-3" orientation="vertical" />

          <div className="flex flex-col sm:h-[300px] mt-2 gap-2 pr-3">
            <div className="flex flex-col gap-1 items-start justify-center pl-2 sm:pl-0">
              <span className="text-sm font-medium text-white">Data e hora:</span>

              {value ? (
                <div className="text-base h-[20px] text-gray/80 w-[144px]">
                  {format(value, "dd/MM/yyyy HH:mm")}
                </div>
              ) : (
                <div className="text-sm h-[20px] text-gray/50 w-[144px]">
                  Selecione uma data
                </div>
              )}
            </div>

            <Separator className="bg-gray/20" />

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex flex-col gap-1 sm:flex-1">
                <span className="text-sm font-medium text-white pl-2 sm:pl-0">Hora:</span>
                <ScrollArea className="w-64 sm:w-auto sm:h-[208px] pr-2 pb-2 sm:pb-0">
                  <div className="flex sm:flex-col pl-2 sm:pl-0 gap-4 sm:gap-0">
                    {Array.from({ length: 24 }, (_, i) => i)
                      .reverse()
                      .map((hour) => {
                        const hourDisabled = value && isSameDay(value, minDate) && isTimeDisabled(hour);
                        
                        return (
                          <Button
                            key={hour}
                            size="icon"
                            variant="ghost"
                            className={cn(
                              "sm:h-8 sm:w-full shrink-0 aspect-square border-0 leading-none p-0 sm:p-2",
                              value && value.getHours() === hour
                                ? "text-white font-semibold sm:font-normal sm:bg-white sm:hover:bg-zinc-200 sm:text-black sm:hover:text-black"
                                : ""
                            )}
                            onClick={() =>
                              handleTimeChange("hour", hour.toString())
                            }
                            disabled={disabled || hourDisabled}
                          >
                            {hour}
                          </Button>
                        );
                      })}
                  </div>
                  <ScrollBar
                    orientation="horizontal"
                    className="sm:hidden pl-2"
                  />
                </ScrollArea>
              </div>

              <Separator className="sm:hidden bg-gray/20" />
              <Separator className="hidden sm:block bg-gray/20" orientation="vertical" />

              <div className="flex flex-col gap-1 sm:flex-1">
                <span className="text-sm font-medium text-white pl-2 sm:pl-0">Minuto:</span>
                <ScrollArea className="w-64 sm:w-auto sm:h-[208px] pr-2 pb-2 sm:pb-0">
                  <div className="flex sm:flex-col pl-2 sm:pl-0 gap-4 sm:gap-0 mb-2 sm:mb-0">
                    {minutes.map((minute) => {
                      const minuteDisabled = 
                        value &&
                        isSameDay(value, minDate) &&
                        isTimeDisabled(value.getHours(), minute);

                      return (
                        <Button
                          key={minute}
                          size="icon"
                          variant="ghost"
                          className={cn(
                            "sm:h-8 sm:w-full shrink-0 aspect-square border-0 leading-none p-0 sm:p-2",
                            value && value.getMinutes() === minute
                              ? "text-white font-semibold sm:font-normal sm:bg-white sm:hover:bg-zinc-200 sm:text-black sm:hover:text-black"
                              : ""
                          )}
                          onClick={() =>
                            handleTimeChange("minute", minute.toString())
                          }
                          disabled={disabled || minuteDisabled}
                        >
                          {minute.toString().padStart(2, "0")}
                        </Button>
                      );
                    })}
                  </div>
                  <ScrollBar
                    orientation="horizontal"
                    className="sm:hidden pl-2"
                  />
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}