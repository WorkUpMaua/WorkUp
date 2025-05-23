import { Link } from 'react-router-dom';
import Logo from '../assets/logo_WorkUp.png';
import Notificacao from '../assets/icon_notificacao.png';

interface HeaderBarProps {
  onMenuClick: () => void;
}

export default function HeaderBar({ onMenuClick }: HeaderBarProps) {
  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-[#34495e] text-white flex items-center justify-between px-8 z-40 shadow-md">
      <div className="flex items-center">
        <button
          className="flex items-center gap-2.5 text-base bg-white/20 border-none cursor-pointer transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/30"
          onClick={onMenuClick}
        >
          <i className="fas fa-bars"></i>
          <span className="font-medium md:inline hidden">Menu</span>
        </button>
      </div>
      <div className="flex items-center justify-center">
        <img src={Logo} alt="WorkUp Logo" className="h-14 filter brightness-0 invert" />
      </div>
      <div className="flex items-center justify-end gap-6">
        <div className="relative cursor-pointer">
          <img src={Notificacao} alt="Notificações" className="w-6 h-6 filter brightness-0 invert" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-[18px] h-[18px] flex items-center justify-center text-xs font-bold">3</span>
        </div>
        <Link to="/user-profile" className="flex items-center gap-2.5 no-underline text-white">
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="Usuário"
            className="w-6 h-6 rounded-full border-2 border-white"
          />
          <span className="text-sm font-medium md:inline hidden">Olá, Usuário</span>
        </Link>
      </div>
    </header>
  );
}