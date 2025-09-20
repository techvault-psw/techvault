interface props {
    shown: boolean,
    closeSidebar: () => void;
}

export const openSidebar = () => {
  const sidebar = document.getElementById('sidebar');
  const content = sidebar?.querySelector('.content');
  const overlay = sidebar?.querySelector('.overlay');
  
  content?.classList.add('transition-transform', 'duration-300');
  overlay?.classList.add('transition-opacity', 'duration-300');

  sidebar?.classList.remove('hidden');
  sidebar?.classList.add('flex');

  setTimeout(() => {
    overlay?.classList.remove('opacity-0');
    overlay?.classList.add('opacity-100');
    content?.classList.remove('translate-x-full');
  }, 1);
};

export const closeSidebar = () => {
  const sidebar = document.getElementById('sidebar');
  const content = sidebar?.querySelector('.content');
  const overlay = sidebar?.querySelector('.overlay');

  content?.classList.add('translate-x-full');
  overlay?.classList.remove('opacity-100');
  overlay?.classList.add('opacity-0');

  setTimeout(() => {
    sidebar?.classList.add('hidden');
  }, 300);
};

export const Sidebar: React.FC<props> = ({ shown, closeSidebar }) => {
    return shown ? (
        <>
            <div id="sidebar" className="absolute inset-0 z-10 hidden">
                <div onClick={() => closeSidebar()} className="overlay z-11 absolute inset-0 bg-overlay/40 backdrop-blur-sm opacity-0"/>

                <div className="content z-12 ml-auto w-4/5 max-w-sm h-full p-4 flex flex-col gap-5 bg-background border-l border-l-gray-2/80 shadow-lg transform translate-x-full">
                    <div className="flex items-start justify-between">
                    <h2 className="font-bold leading-none text-2xl text-white">Menu</h2>

                    <button onClick={() => closeSidebar()} className="size-6 cursor-pointer">
                        <img className="size-full" src="./assets/x.svg" alt="Fechar"/>
                    </button>
                    </div>

                    <hr className="border-t-1 border-gray-2/50"/>

                    <div className="flex justify-between items-center gap-2 leading-none">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-white font-semibold text-xl">José da Silva</h3>
                        <p className="text-gray-2">jose.silva@email.com</p>
                    </div>

                    <button className="p-2 text-red bg-red/10 hover:bg-red/15 transition-colors duration-200 rounded-lg cursor-pointer border border-red">
                        <img className="size-4" src="./assets/log-out.svg" alt="Sair"/>
                    </button>
                    </div>

                    <hr className="border-t-1 border-gray-2/50"/>

                    <nav className="flex flex-col gap-2">
                        <a href="./perfil.html" className="py-1 pl-1.5 -ml-1.5 flex items-center gap-2 text-xl text-white leading-[120%] cursor-pointer hover:bg-white/10 transition-colors transition-300 rounded-lg">
                            <img className="size-7" src="./assets/sidebar-icons/person.svg" alt="Perfil"/>
                            <span>Perfil</span>
                        </a>
                        
                        <a href="./home.html" className="py-1 pl-1.5 -ml-1.5 flex items-center gap-2 text-xl text-white leading-[120%] cursor-pointer hover:bg-white/10 transition-colors transition-300 rounded-lg">
                            <img className="size-7" src="./assets/sidebar-icons/home.svg" alt="Home"/>
                            <span>Home</span>
                        </a>

                        <a href="./pacotes-disponiveis.html" className="py-1 pl-1.5 -ml-1.5 flex items-center gap-2 text-xl text-white leading-[120%] cursor-pointer hover:bg-white/10 transition-colors transition-300 rounded-lg">
                            <img className="size-7" src="./assets/sidebar-icons/box.svg" alt="Pacotes Disponíveis"/>
                            <span>Pacotes Disponíveis</span>
                        </a>

                        <a href="./minhas-reservas.html" className="py-1 pl-1.5 -ml-1.5 flex items-center gap-2 text-xl text-white leading-[120%] cursor-pointer hover:bg-white/10 transition-colors transition-300 rounded-lg">
                            <img className="size-7" src="./assets/sidebar-icons/calendar.svg" alt="Minhas Reservas"/>
                            <span>Minhas Reservas</span>
                        </a>

                        <a href="./feedbacks.html" className="py-1 pl-1.5 -ml-1.5 flex items-center gap-2 text-xl text-white leading-[120%] cursor-pointer hover:bg-white/10 transition-colors transition-300 rounded-lg">
                            <img className="size-7" src="./assets/sidebar-icons/comment.svg" alt="Feedbacks"/>
                            <span>Feedbacks</span>
                        </a>
                    </nav>

                    <hr className="gerente suporte border-t-1 border-gray-2/50"/>

                    <nav className="gerente suporte flex flex-col gap-2">
                        <a href="./dashboard.html" className="py-1 pl-1.5 -ml-1.5 flex items-center gap-2 text-xl text-white leading-[120%] cursor-pointer hover:bg-white/10 transition-colors transition-300 rounded-lg">
                            <img className="size-7" src="./assets/sidebar-icons/dashboard.svg" alt="Dashboard"/>
                            <span>Dashboard</span>
                        </a>

                        <a href="./reservas.html" className="py-1 pl-1.5 -ml-1.5 flex items-center gap-2 text-xl text-white leading-[120%] cursor-pointer hover:bg-white/10 transition-colors transition-300 rounded-lg">
                            <img className="size-7" src="./assets/sidebar-icons/calendars.svg" alt="Gerenciar Reservas"/>
                            <span>Gerenciar Reservas</span>
                        </a>

                        <a href="./pacotes.html" className="gerente py-1 pl-1.5 -ml-1.5 flex items-center gap-2 text-xl text-white leading-[120%] cursor-pointer hover:bg-white/10 transition-colors transition-300 rounded-lg">
                            <img className="size-7" src="./assets/sidebar-icons/cube.svg" alt="Gerenciar Pacotes"/>
                            <span>Gerenciar Pacotes</span>
                        </a>

                        <a href="./clientes.html" className="gerente py-1 pl-1.5 -ml-1.5 flex items-center gap-2 text-xl text-white leading-[120%] cursor-pointer hover:bg-white/10 transition-colors transition-300 rounded-lg">
                            <img className="size-7" src="./assets/sidebar-icons/people.svg" alt="Gerenciar Clientes"/>
                            <span>Gerenciar Clientes</span>
                        </a>
                    </nav>
                </div>
            </div>
        </>
    ) : null;
};