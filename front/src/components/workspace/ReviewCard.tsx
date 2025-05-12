import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

interface ReviewCardProps {
    userName: string;
    userImage: string;
    rating: number; // de 0 a 5
    daysAgo: string;
    stayDuration: string;
    comment: string;
}

export default function ReviewCard({
    userName,
    userImage,
    rating,
    daysAgo,
    stayDuration,
    comment,
}: ReviewCardProps) {

     // Função para gerar estrelas baseadas na nota
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const emptyStars = 5 - fullStars;

        return (
            <div className="flex gap-0.5 text-yellow-500">
                {Array(fullStars).fill(0).map((_, i) => (
                    <AiFillStar key={`full-${i}`} size={18} />
                ))}
                {Array(emptyStars).fill(0).map((_, i) => (
                    <AiOutlineStar key={`empty-${i}`} size={18} />
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-2 p-4 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
                <img
                    src={userImage}
                    alt={userName}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{userName}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
                {/* Estrelas */}
                {renderStars(rating)}
                <span className="font-semibold">{daysAgo}</span>
                <span>·</span>
                <span className="text-gray-400">{stayDuration}</span>
            </div>

            <p className="text-gray-700">{comment}</p>
        </div>
    );
}
