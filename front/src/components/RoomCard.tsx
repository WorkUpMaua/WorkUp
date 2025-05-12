import { useNavigate } from 'react-router-dom';

type RoomCardProps = {
  imgPath: string,
  name: string
  id?: string
}

export default function RoomCard(props: RoomCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/workspace/${props.id}`);
  };

  return (
    <div
      className="w-80 bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition duration-75 hover:-translate-y-1"
      onClick={handleClick}
    >
      <img
        src={props.imgPath}
        alt={props.name}
        className="w-full h-60 object-cover"
      />
      <div className="py-4 text-center">
        <h2 className="text-xl font-bold text-gray-800">{props.name}</h2>
      </div>
    </div>
  )
}













