import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SidebarMenu from "../components/SidebarMenu";
import HeaderBar from "../components/HeaderBar";
import HomeSearchForm from "../components/HomeSearchForm";
import ListingGrid from "../components/ListingGrid";
import CreatePropriedades from "../pages/CreatePropriedades";
import { getCookie } from "../utils/cookies";

interface Listing {
  id: string;
  title: string;
  image: string;
  price: number;
  address: string;
  amenities: string[];
}

export type HomeFiltersType = {
  startDate: string;
  endDate: string;
  address: string;
  guests: string | number;
  minPrice: string;
  maxPrice: string;
};

const listingsData: Listing[] = [
  {
    id: "1",
    title: "Escritório Moderno no Centro",
    image: "https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg",
    price: 1200,
    address: "Av. Paulista, 1000 - São Paulo/SP",
    amenities: ["Wi-Fi", "Ar Condicionado", "Cozinha"],
  },
  {
    id: "2",
    title: "Sala Comercial Premium",
    image: "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg",
    price: 1800,
    address: "Rua Oscar Freire, 2000 - São Paulo/SP",
    amenities: ["Wi-Fi", "Ar Condicionado", "Estacionamento"],
  },
  {
    id: "3",
    title: "Coworking Espaçoso",
    image: "https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg",
    price: 900,
    address: "Alameda Santos, 500 - São Paulo/SP",
    amenities: ["Wi-Fi", "Cafeteria", "Sala de Reuniões"],
  },
  {
    id: "4",
    title: "Escritório com Vista",
    image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg",
    price: 2500,
    address: "Brooklin Novo, 300 - São Paulo/SP",
    amenities: ["Wi-Fi", "Ar Condicionado", "Varanda", "Limpeza Diária"],
  },
];

export default function Home(): React.ReactElement {
  const [sidebarActive, setSidebarActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredListings, setFilteredListings] =
    useState<Listing[]>(listingsData);
  const [filters, setFilters] = useState<HomeFiltersType>({
    startDate: "",
    endDate: "",
    address: "",
    guests: '',
    minPrice: "",
    maxPrice: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie('token')
    if(!token) navigate('/login')
  }, [navigate]);

  useEffect(() => {
    const results = listingsData.filter((listing) => {
      const matchesSearch =
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice =
        (!filters.minPrice || listing.price >= Number(filters.minPrice)) &&
        (!filters.maxPrice || listing.price <= Number(filters.maxPrice));
      return matchesSearch && matchesPrice;
    });
    setFilteredListings(results);
  }, [searchQuery, filters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-bg-light to-gray-100">
      <SidebarMenu
        active={sidebarActive}
        onClose={() => setSidebarActive(false)}
      />
      <HeaderBar onMenuClick={() => setSidebarActive(!sidebarActive)} />
      <main className="mt-20 p-10 w-full min-h-[calc(100vh-80px)] flex justify-center">
        <div className="w-full max-w-[1600px] mx-auto flex flex-col items-center">
          <div className="w-full mb-10 text-center">
            <h1 className="text-4xl text-secondary mb-4 font-bold">
              Encontre o espaço perfeito para seu negócio
            </h1>
            <p className="text-lg text-text-gray mb-8 max-w-[700px] mx-auto">
              Descubra escritórios e salas comerciais que combinam com sua
              necessidade
            </p>
            <HomeSearchForm
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filters={filters}
              setFilters={setFilters}
              onSubmit={handleSubmit}
            />
          </div>
          <div className="w-full">
            <h2 className="text-3xl text-secondary mb-8 font-semibold text-center">
              Espaços disponíveis
            </h2>
            <ListingGrid listings={filteredListings} />
          </div>
        </div>
      </main>
      <Routes>
        <Route path="/create-propriedades" element={<CreatePropriedades />} />
      </Routes>
    </div>
  );
}
