import { useNavigate } from "react-router-dom"; // Adicione este import

interface SidebarMenuProps {
  active: boolean;
  onClose: () => void;
}

export default function SidebarMenu({ active, onClose }: SidebarMenuProps) {
  const navigate = useNavigate();

  return (
    <>
      {active && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        ></div>
      )}
      <div
        className={`fixed top-0 left-0 w-[280px] h-full bg-[#34495e] text-white py-5 -translate-x-full transition-transform duration-300 z-50 shadow-lg flex flex-col ${
          active ? "translate-x-0" : ""
        }`}
      >
        <div className="p-5 text-center border-b border-white/10 mb-5">
          <h2 className="text-2xl font-semibold">WorkUp</h2>
        </div>
        <ul className="flex-grow">
          <li className="px-6 py-4 transition-all duration-300 flex items-center gap-4 text-sm hover:bg-white/10 hover:pl-8">
            <i className="fas fa-plus w-5 text-center"></i>{" "}
            <a
              className="cursor-pointer"
              onClick={() => {
                navigate("/");
                onClose();
              }}
            >
              Home
            </a>
          </li>
          <li className="px-6 py-4 transition-all duration-300 flex items-center gap-4 text-sm hover:bg-white/10 hover:pl-8">
            <i className="fas fa-plus w-5 text-center"></i>{" "}
            <a
              className="cursor-pointer"
              onClick={() => {
                navigate("/user-profile");
                onClose();
              }}
            >
              Perfil
            </a>
          </li>

           <li className="px-6 py-4 transition-all duration-300 flex items-center gap-4 text-sm hover:bg-white/10 hover:pl-8">
            <i className="fas fa-plus w-5 text-center"></i>{" "}
            <a
              className="cursor-pointer"
              onClick={() => {
                navigate("/rent");
                onClose();
              }}
            >
              Minhas Reservas
            </a>
          </li>

          {/* <li className="px-6 py-4 cursor-pointer transition-all duration-300 flex items-center gap-4 text-sm hover:bg-white/10 hover:pl-8">
            <i className="fas fa-cog w-5 text-center"></i> Configurações
          </li> */}

          <li className="px-6 py-4 transition-all duration-300 flex items-center gap-4 text-sm hover:bg-white/10 hover:pl-8">
            <i className="fas fa-plus w-5 text-center"></i>{" "}
            <a
              className="cursor-pointer"
              onClick={() => {
                navigate("/properties");
                onClose();
              }}
            >
              Gerenciar Propriedades
            </a>
          </li>

          <li className="px-6 py-4 transition-all duration-300 flex items-center gap-4 text-sm hover:bg-white/10 hover:pl-8">
            <i className="fas fa-plus w-5 text-center"></i>{" "}
            <a
              className="cursor-pointer"
              onClick={() => {
                navigate("/create-property");
                onClose();
              }}
            >
              Criar Sala
            </a>
          </li>
          <li className="px-6 py-4 transition-all duration-300 flex items-center gap-4 text-sm hover:bg-white/10 hover:pl-8">
            <i className="fas fa-plus w-5 text-center"></i>{" "}
            <a
              className="cursor-pointer"
              onClick={() => {
                const response = window.confirm("Certeza que deseja sair?");
                if (response) {
                  document.cookie =
                    "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  location.reload();
                }
              }}
            >
              Sair
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
