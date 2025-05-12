import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';

export default function BackButton() {
    const navigate = useNavigate();

    return (
        <div>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold py-2 group cursor-pointer"
            >
                <AiOutlineArrowLeft className="text-xl transform group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Voltar</span>
            </button>
        </div>
    );
}
