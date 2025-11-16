/**
 * @fileoverview Página inicial do sistema
 * 
 * Esta página é a landing page pública do sistema, apresentando o propósito
 * do negócio e oferecendo acesso direto aos pacotes disponíveis.
 * 
 * @module pages/HomePage
 */

import Header from "@/components/header/header";
import { Link } from "react-router";

/**
 * Componente da página inicial (Home)
 * 
 * Página de apresentação do sistema que:
 * - Exibe header com navegação
 * - Apresenta slogan e proposta de valor do negócio
 * - Oferece call-to-action para buscar pacotes
 * - Utiliza imagem de background em fullscreen
 * 
 * Esta é uma página pública, acessível sem autenticação.
 * 
 * @component
 * @returns {JSX.Element} Página inicial
 * 
 * @example
 * // Uso no roteamento
 * <Route path="/" element={<HomePage />} />
 */
export default function HomePage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        <div className="absolute inset-0 -z-1">
          <img 
            src="/background.png" 
            className="w-full h-full object-cover object-[60%_center]"
          />
        </div>
        
        <div className="w-full h-full max-w-7xl mx-auto py-7 px-2 flex flex-col gap-8 items-center justify-between sm:items-start sm:justify-start lg:items-left sm:px-16 sm:py-12 lg:gap-16 2xl:px-0">
          <h2 className="text-3xl font-bold text-white text-center leading-[150%] text-shadow-primary sm:text-4xl lg:text-[2.5rem] sm:text-left lg:text-left">
            SETUPS PROFISSIONAIS<br />
            EM <span className="bg-linear-(--gradient-primary-b)">&nbsp;QUALQUER LUGAR&nbsp;</span><br /> 
            E A QUALQUER HORA
          </h2>

          <Link
            to="pacotes-disponiveis"
            className="mb-24 py-4 px-9 text-white text-2xl font-bold bg-linear-(--gradient-primary-b) hover:brightness-109 transition-[filter] duration-200hover:brightness-109 duration-200 rounded-lg leading-none cursor-pointer lg:text-[1.75rem]"
            >
            Buscar pacotes
          </Link>
        </div>
      </main>
    </>
  );
}