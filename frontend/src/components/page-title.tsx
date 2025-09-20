import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface PageTitleProps extends ComponentProps<'h2'> {}

export const PageTitle = ({ children, className, ...props }: PageTitleProps) => {
  return (
    <h2 className={cn("text-white text-3xl font-bold md:text-4xl", className)} {...props}>
      {children}
    </h2>
  );
}
