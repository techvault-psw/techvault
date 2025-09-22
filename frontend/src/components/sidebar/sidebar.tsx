import { X } from "lucide-react";
import { BoxIcon } from "../icons/box-icon";
import { CalendarIcon } from "../icons/calendar-icon";
import { CalendarsIcon } from "../icons/calendars-icon";
import { CommentIcon } from "../icons/comment-icon";
import { CubeIcon } from "../icons/cube-icon";
import { DashboardIcon } from "../icons/dashboard-icon";
import { HomeIcon } from "../icons/home-icon";
import { LogOutIcon } from "../icons/log-out-icon";
import { PeopleIcon } from "../icons/people-icon";
import { PersonIcon } from "../icons/person-icon";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SidebarItem } from "./sidebar-item";

interface SidebarProps {
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

export const Sidebar: React.FC<SidebarProps> = ({ closeSidebar }) => {
    return (
        <div id="sidebar" className="absolute inset-0 z-10 hidden">
            <div onClick={() => closeSidebar()} className="overlay z-11 absolute inset-0 bg-overlay/40 backdrop-blur-sm opacity-0"/>

            <div className="content z-12 ml-auto w-4/5 max-w-sm h-full p-4 flex flex-col gap-5 bg-background border-l border-l-gray/50 shadow-lg transform translate-x-full">
                <div className="flex items-start justify-between">
                    <h2 className="font-bold leading-none text-2xl text-white">Menu</h2>

                    <button onClick={() => closeSidebar()} className="size-6 cursor-pointer">
                        <X className="size-full" />
                    </button>
                </div>

                <Separator />

                <div className="flex justify-between items-center gap-2">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-white font-semibold text-xl">José da Silva</h3>
                        <p className="text-gray text-base leading-none">jose.silva@email.com</p>
                    </div>

                    <Button variant="destructive" size="icon">
                        <LogOutIcon className="size-4" />
                    </Button>
                </div>

                <Separator />

                <nav className="flex flex-col gap-2">
                    <SidebarItem closeSidebar={closeSidebar} display="Perfil" icon={PersonIcon} to="/perfil" />
                    <SidebarItem closeSidebar={closeSidebar} display="Home" icon={HomeIcon} to="/" />
                    <SidebarItem closeSidebar={closeSidebar} display="Pacotes Disponíveis" icon={BoxIcon} to="/pacotes-disponiveis" />
                    <SidebarItem closeSidebar={closeSidebar} display="Minhas Reservas" icon={CalendarIcon} to="/minhas-reservas" />
                    <SidebarItem closeSidebar={closeSidebar} display="Feedbacks" icon={CommentIcon} to="/feedbacks" />
                </nav>

                <Separator className="gerente suporte" />

                <nav className="gerente suporte flex flex-col gap-2">
                    <SidebarItem closeSidebar={closeSidebar} display="Dashboard" icon={DashboardIcon} to="/dashboard" />
                    <SidebarItem closeSidebar={closeSidebar} display="Gerenciar Reservas" icon={CalendarsIcon} to="/reservas" />
                    <SidebarItem closeSidebar={closeSidebar} display="Gerenciar Pacotes" icon={CubeIcon} to="/pacotes" />
                    <SidebarItem closeSidebar={closeSidebar} display="Gerenciar Clientes" icon={PeopleIcon} to="/clientes" />
                </nav>
            </div>
        </div>
    )
};