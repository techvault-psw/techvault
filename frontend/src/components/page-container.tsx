/**
 * @fileoverview Componentes de layout para páginas da aplicação
 * 
 * Conjunto de componentes que fornecem estrutura e estilo consistente
 * para diferentes tipos de páginas (card, lista, autenticação).
 * Todos compartilham espaçamento, bordas, backdrop blur e responsividade.
 * 
 * @module components/PageContainer
 */

import { type ComponentProps, type ReactNode } from "react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

/**
 * Props dos componentes PageContainer
 * 
 * @interface PageContainerProps
 * @property {ReactNode} children - Conteúdo a ser renderizado dentro do container
 */
interface PageContainerProps {
  children?: ReactNode;
}

/**
 * Container para páginas em formato de card
 * 
 * Renderiza o conteúdo dentro de um card centrado com bordas arredondadas,
 * fundo semitransparente, backdrop blur e sombra. Apropriado para páginas
 * que exibem informações em um layout de card/modal, como perfil e formulários.
 * 
 * @component
 * @param {PageContainerProps} props - Props do componente
 * @param {ReactNode} props.children - Conteúdo do card
 * @returns {JSX.Element} Div com estilo de card responsivo
 * 
 * @example
 * <PageContainer.Card>
 *   <PageTitle>Perfil</PageTitle>
 *   { Conteúdo }
 * </PageContainer.Card>
 */
const PageContainerCard = ({ children }: PageContainerProps) => {
  return (
    <div className="w-full h-full max-w-7xl mx-auto p-4 relative lg:px-16 2xl:px-0">
      <section className="w-full h-full border border-gray/50 bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-7 flex flex-col gap-5">
        {children}
      </section>
    </div>  
  );
};

/**
 * Container para páginas em formato de lista/tabela
 * 
 * Renderiza o conteúdo em layout flexível apropriado para listagens,
 * tabelas e grids de itens. Mantém responsividade com diferentes
 * alinhamentos para mobile e desktop.
 * 
 * @component
 * @param {PageContainerProps} props - Props do componente
 * @param {ReactNode} props.children - Conteúdo da lista
 * @returns {JSX.Element} Div com layout de lista responsivo
 * 
 * @example
 * <PageContainer.List>
 *   <PageTitle>Clientes</PageTitle>
 *   <Table>{ Linhas da tabela }</Table>
 * </PageContainer.List>
 */
const PageContainerList = ({ children }: PageContainerProps) => {
  return (
    <div className="w-full h-full max-w-7xl mx-auto p-4 flex flex-col items-center gap-4 relative sm:px-16 2xl:px-0 md:items-start">
      {children}
    </div>
  )
}

/**
 * Container para páginas de autenticação (login, cadastro)
 * 
 * Renderiza um card centrado com logo, apropriado para formulários
 * de autenticação. Logo posicionada absolutamente no canto superior.
 * 
 * @component
 * @param {ComponentProps<'div'>} props - Props do componente (inclui className)
 * @param {string} [props.className] - Classes Tailwind adicionais
 * @param {ReactNode} props.children - Conteúdo do formulário
 * @returns {JSX.Element} Div com layout de autenticação
 * 
 * @example
 * <PageContainer.Auth>
 *   <FormField name="email" label="E-mail" />
 *   <Button type="submit">Login</Button>
 * </PageContainer.Auth>
 */
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

/**
 * Objeto exportado com os três tipos de containers
 * 
 * @constant
 * @type {Object}
 * @property {Function} Card - Container em formato de card para páginas de perfil e formulários
 * @property {Function} List - Container em formato de lista para páginas de listagem e tabelas
 * @property {Function} Auth - Container para páginas de autenticação
 */
export const PageContainer = {
  Card: PageContainerCard,
  List: PageContainerList,
  Auth: PageContainerAuth,
}
