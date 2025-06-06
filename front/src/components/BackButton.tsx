import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';

interface BackButtonProps {
  onClick?: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 text-[#34495e] hover:text-[#34495e]/85 font-semibold py-2 group cursor-pointer"
      >
        <AiOutlineArrowLeft className="text-xl transform group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Voltar</span>
      </button>
    </div>
  );
}

