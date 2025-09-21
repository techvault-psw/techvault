import { type ComponentProps, type ReactNode } from "react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children?: ReactNode;
}

const PageContainerCard = ({ children }: PageContainerProps) => {
  return (
    <div className="w-full h-full max-w-7xl mx-auto p-4 relative lg:px-16 2xl:px-0">
      <section className="w-full h-full border border-gray-2/50 bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-7 flex flex-col gap-5">
        {children}
      </section>
    </div>  
  );
};

const PageContainerList = ({ children }: PageContainerProps) => {
  return (
    <div className="w-full h-full max-w-7xl mx-auto p-4 flex flex-col items-center gap-4 relative sm:px-16 2xl:px-0 md:items-start">
      {children}
    </div>
  )
}

const PageContainerAuth = ({ className, children, ...props }: ComponentProps<'div'>) => {
  return (
    <>
      <Logo className="absolute" />

      <div
        className={cn("my-auto border border-gray/50 bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-7 w-full max-w-md flex flex-col gap-5", className)}
        {...props}
      >
        {children}
      </div>
    </>
  )
}

export const PageContainer = {
  Card: PageContainerCard,
  List: PageContainerList,
  Auth: PageContainerAuth,
}
