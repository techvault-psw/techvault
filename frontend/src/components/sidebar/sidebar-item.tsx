import { cn } from "@/lib/utils";
import type { ComponentType, SVGProps } from "react";
import { Link, type LinkProps } from "react-router";

interface SidebarItemProps extends LinkProps {
  display: string
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  closeSidebar: () => void;
}

export const SidebarItem = ({ display, icon: Icon, closeSidebar, className, ...props }: SidebarItemProps) => {
  return (
    <Link
      onClick={closeSidebar}
      className={cn("py-1 pl-1.5 -ml-1.5 flex items-center gap-2 text-xl text-white leading-[120%] cursor-pointer hover:bg-white/10 transition-colors transition-300 rounded-lg", className)}
      {...props}
    >
      <Icon className="size-7" />
      <span>{display}</span>
    </Link>
  );
}
