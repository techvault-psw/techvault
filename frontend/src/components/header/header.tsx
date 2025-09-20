import { useState, useEffect } from 'react';
import { Sidebar, openSidebar, closeSidebar } from '../sidebar/sidebar';

const Header: React.FC = () => {
    const [showSidebar, setShowSidebar] = useState(false);

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
                <a href="./home.html" className="flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors transition-300 rounded-lg">
                    <img src="./assets/logo.png" className="w-7"/>
                    <h1 className="text-2xl font-bold text-white">TechVault</h1>
                </a>

                <nav className="gap-8 items-center leading-none text-white font-medium hidden lg:flex">
                    <a href="./pacotes-disponiveis.html" className="hover:underline">Pacotes</a>
                    <a href="./minhas-reservas.html" className="hover:underline">Reservas</a>
                    <a href="./feedbacks.html" className="hover:underline">Feedbacks</a>
                    <a href="./dashboard.html" className="gerente suporte hover:underline">Dashboard</a>
                    <a href="./perfil.html" className="hover:underline">Perfil </a>
                </nav>

                <button onClick={() => setShowSidebar(true)} className="cursor-pointer size-5 lg:hidden">
                    <img src="assets/menu.svg" className="size-full"/>
                </button>
            </div>
        </header>

        {showSidebar && <Sidebar shown={showSidebar} closeSidebar={() => setShowSidebar(false)}/>}
        </>
    )
};

export default Header;