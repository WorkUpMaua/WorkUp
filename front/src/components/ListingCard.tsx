import { Link } from "react-router-dom";
import { Listing } from "../pages/Home";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 flex flex-col relative hover:-translate-y-1 hover:shadow-xl">
      <div className="relative w-full h-[220px] overflow-hidden">
        <img
          src={`http://localhost:4003/${listing.pictures[0]}`}
          alt={listing.name}
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
        />

        <span className="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-full font-bold text-sm z-[1] border-header bg-[#34495e]">
          R$ {listing.price.toLocaleString("pt-BR")}/hora
        </span>

        <button className="absolute top-4 right-4 bg-[#34495e] text-white border-none w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-[1] hover:text-white">
          <span className="font-bold text-sm">{listing.capacity}</span>
        </button>
      </div>


      <div className="p-5 flex-grow flex flex-col">

        <h3 className="text-xl font-semibold text-secondary mb-2.5">
          {listing.name}
        </h3>

        <p className="text-text-gray text-sm mb-4 flex items-center gap-1.5">
          <i className="fas fa-map-marker-alt text-primary"></i>
          {listing.address}
        </p>

        <div className="flex flex-wrap gap-0.5 mt-4 mb-5">
          {listing.comodities.map((comodity, index) => (
            <span
              key={index}
              className="bg-primary/10 px-1 py-1.5 rounded-full text-xs text-primary flex items-center gap-1.5"
            >
              <p className="bg-gray-100 px-4 py-2 rounded-full text-gray-700 text-[0.7rem]">
                {comodity}
              </p>
            </span>
          ))}
        </div>
        <Link
          to={`/workspace/${listing.id}`}
          className="mt-auto bg-transparent border border-primary text-primary px-4 py-2.5 rounded-lg cursor-pointer font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:bg-[#34495e] hover:text-white hover:border-[#34495e] hover:-translate-y-0.5"
        >
          Ver detalhes <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
}
