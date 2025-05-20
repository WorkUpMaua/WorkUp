import { Link } from 'react-router-dom';

interface Listing {
  id: string;
  title: string;
  image: string;
  price: number;
  address: string;
  amenities: string[];
}

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 flex flex-col relative hover:-translate-y-1 hover:shadow-xl">
      <div className="relative w-full h-[220px] overflow-hidden">
        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105" />
        <span className="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-full font-bold text-sm z-[1]">
          R$ {listing.price.toLocaleString('pt-BR')}/dia
        </span>
        <button className="absolute top-4 right-4 bg-blue-500 text-text-gray border-none w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-[1] hover:text-red-500 hover:scale-110">
          <i className="far fa-heart"></i>
        </button>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-semibold text-secondary mb-2.5">{listing.title}</h3>
        <p className="text-text-gray text-sm mb-4 flex items-center gap-1.5">
          <i className="fas fa-map-marker-alt text-primary"></i> {listing.address}
        </p>
        <div className="flex flex-wrap gap-2 mt-4 mb-5">
          {listing.amenities.map((amenity, index) => (
            <span key={index} className="bg-primary/10 px-3 py-1.5 rounded-full text-xs text-primary flex items-center gap-1.5">
              <i className="fas fa-check text-[0.7rem]"></i> {amenity}
            </span>
          ))}
        </div>
        <Link
          to={`/workspace/${listing.id}`}
          className="mt-auto bg-transparent border border-primary text-primary px-4 py-2.5 rounded-lg cursor-pointer font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:bg-primary hover:text-white hover:-translate-y-0.5"
        >
          Ver detalhes <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
}