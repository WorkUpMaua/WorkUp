import ListingCard from './ListingCard';

interface Listing {
  id: string;
  title: string;
  image: string;
  price: number;
  address: string;
  amenities: string[];
}

interface ListingGridProps {
  listings: Listing[];
}

export default function ListingGrid({ listings }: ListingGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}