/**
 * @fileoverview Componente Header da aplicação
 * 
 * Componente responsável por renderizar o cabeçalho da página com logo,
 * navegação principal (desktop) e menu hambúrguer (mobile).
 * Integra-se com a Sidebar para exibição do menu lateral em dispositivos móveis.
 * 
 * @module components/header/Header
 */

import { useState, useEffect } from 'react';
import { Sidebar, openSidebar, closeSidebar } from '../sidebar/sidebar';
import { HeaderItem } from './header-item';
import { Logo } from '../logo';
import { MenuIcon } from '../icons/menu-icon';
import useCargo from '@/hooks/useCargo';

/**
 * Componente Header
 * 
 * Renderiza o cabeçalho da aplicação com:
 * - Logo clicável (redirecionando para home)
 * - Navegação horizontal para desktop (Pacotes, Reservas, Feedbacks, Dashboard, Perfil)
 * - Menu hambúrguer para mobile que abre a Sidebar
 * - Links de navegação condicionais baseados no cargo do usuário (gerente/suporte)
 * 
 * @component
 * @returns {JSX.Element} Elemento header com navegação e sidebar integrada
 * 
 * @example
 * <Header />
 */
const Header: React.FC = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    const {isGerente, isSuporte} = useCargo()

    useEffect(() => {
        if(showSidebar) {
            openSidebar();
        } else {
            closeSidebar();
        }
    }, [showSidebar]);

    return (
        <>
            <header className="bg-background flex-shrink-0">
                <div className="w-full max-w-7xl mx-auto p-3 flex items-center justify-between sm:px-16 2xl:px-0 lg:py-3.5">
                    <Logo />

                    <nav className="gap-8 items-center leading-none text-white font-medium hidden lg:flex">
                        <HeaderItem to="/pacotes-disponiveis">Pacotes</HeaderItem>
                        <HeaderItem to="/minhas-reservas">Reservas</HeaderItem>
                        <HeaderItem to="/feedbacks">Feedbacks</HeaderItem>
                        {(isGerente() || isSuporte()) && <HeaderItem to="/dashboard">Dashboard</HeaderItem>}
                        <HeaderItem to="/perfil">Perfil</HeaderItem>
                    </nav>

                    <button onClick={() => setShowSidebar(true)} className="cursor-pointer size-5 lg:hidden">
                        <MenuIcon className="size-full" />
                    </button>
                </div>
            </header>

            <Sidebar closeSidebar={() => setShowSidebar(false)}/>
        </>
    )
};

export default Header;