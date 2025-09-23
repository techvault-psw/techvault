import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { Link } from "react-router";

interface LogoProps extends ComponentProps<'a'> {
}

export const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <Link
      to="/"
      className={cn("flex items-center gap-2 cursor-pointer transition-colors transition-300 rounded-lg", className)}
      {...props}
    >
      <img src="/logo.png" className="w-7"/>
      <h1 className="text-2xl font-bold text-white">TechVault</h1>
    </Link>
  );
}
