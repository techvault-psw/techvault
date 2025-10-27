import { cn } from "@/lib/utils";
import { ArrowLeftIcon as LucideArrowLeft } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";

interface GoBackButtonProps extends ComponentProps<'button'> {
  to?: string 
}

export const GoBackButton = ({ to, onClick, className, ...props }: GoBackButtonProps) => {
  const navigate = useNavigate()

  const handleClick = to
    ? () => navigate(to)
    : onClick
      ? onClick
      : () => window.history.back()

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleClick}
      className={cn("text-white !p-1.5 hover:bg-white/15 rounded-full transition-colors hidden md:flex flex-none", className)} {...props}
    >
      <LucideArrowLeft className="size-6.5 stroke-3 mx-auto" />
    </Button>
  )
}
