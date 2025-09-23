import { useState, useEffect } from 'react';
import { Sidebar, openSidebar, closeSidebar } from '../sidebar/sidebar';
import { HeaderItem } from './header-item';
import { Logo } from '../logo';
import { MenuIcon } from '../icons/menu-icon';
import useCargo from '@/hooks/useCargo';

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
                        {isGerente() || isSuporte() && <HeaderItem to="/dashboard" className="gerente suporte">Dashboard</HeaderItem>}
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