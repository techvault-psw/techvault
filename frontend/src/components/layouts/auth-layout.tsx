import { type ReactNode } from "react";
import { Outlet } from "react-router";

interface AuthLayoutProps {
  children?: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <main className="flex-1 p-4 flex flex-col items-center gap-4 relative min-h-0">
      <div className="absolute inset-0 -z-1">
        <img src="./background.png" className="w-full h-full object-cover object-[60%_center]" />

        <div className="absolute inset-0 bg-black/60" />
      </div>

      <Outlet />
    </main>
  )
}
