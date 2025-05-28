import { Link } from "react-router-dom";

interface SidebarMenuProps {
  active: boolean;
  onClose: () => void;
}

export default function SidebarMenu({ active, onClose }: SidebarMenuProps) {
  return (
    <>
      {active && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity" onClick={onClose}></div>
      )}
      <div className={`fixed top-0 left-0 w-[280px] h-full bg-[#34495e] text-white py-5 -translate-x-full transition-transform duration-300 z-50 shadow-lg flex flex-col ${active ? 'translate-x-0' : ''}`}>
        <div className="p-5 text-center border-b border-white/10 mb-5">
          <h2 className="text-2xl font-semibold">WorkUp</h2>
        </div>
        <ul className="flex-grow">
          <li className="px-6 py-4 cursor-pointer transition-all duration-300 flex items-center gap-4 text-sm hover:bg-white/10 hover:pl-8">
            <i className="fas fa-home w-5 text-center"></i> Dashboard
          </li>
          <li className="px-6 py-4 cursor-pointer transition-all duration-300 flex items-center gap-4 text-sm hover:bg-white/10 hover:pl-8">
            <i className="fas fa-user w-5 text-center"></i> Perfil
          </li>
          <li className="px-6 py-4 cursor-pointer transition-all duration-300 flex items-center gap-4 text-sm hover:bg-white/10 hover:pl-8">
            <i className="fas fa-cog w-5 text-center"></i> Configurações
          </li>
          <li className="px-6 py-4 transition-all duration-300 flex items-center gap-4 text-sm hover:bg-white/10 hover:pl-8">
            <Link
              to="/propriedades"
              className="flex items-center gap-4 w-full h-full text-white no-underline"
              onClick={onClose}
            >
              <i className="fas fa-building w-5 text-center"></i> Minhas Propriedades
            </Link>
          </li>
          <li className="px-6 py-4 cursor-pointer transition-all duration-300 flex items-center gap-4 text-sm hover:bg-white/10 hover:pl-8">
            <i className="fas fa-sign-out-alt w-5 text-center"></i> Sair
          </li>
        </ul>
      </div>
    </>
  );
}