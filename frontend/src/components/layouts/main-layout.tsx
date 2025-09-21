import { type ReactNode } from "react";
import Header from "../header/header";
import { Outlet } from "react-router";

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Header />

      <main className="flex-1 overflow-y-hidden">
        <div className="absolute inset-0 -z-1">
          <img 
            src="/background.png" 
            className="w-full h-full object-cover object-[60%_center]"
          />

          <div className="absolute inset-0 bg-black/60" />
        </div>

        <Outlet />
      </main>
    </>
  );
};
