import { cn } from "@/lib/utils";
import { Link, type LinkProps } from "react-router";

interface HeaderItemProps extends LinkProps {}

export const HeaderItem = ({ className, ...props }: HeaderItemProps) => {
  return (
    <Link
      className={cn("hover:underline text-base", className)}
      {...props}
    />
  );
}
