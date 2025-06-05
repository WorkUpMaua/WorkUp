import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SidebarMenu from "../components/SidebarMenu";
import HeaderBar from "../components/HeaderBar";
import HomeSearchForm, { HomeFiltersType } from "../components/HomeSearchForm";
import ListingGrid from "../components/ListingGrid";
import CreatePropriedades from "../pages/CreatePropriedades";
import { getCookie } from "../utils/cookies";
import disponibilidadeClient from "../utils/disponibilidadeClient";

export interface Listing {
  id: string;
  name: string;
  address: string;
  comodities: string[];
  pictures: string[];
  price: number;
  capacity: number;
}

export default function Home(): React.ReactElement {
  const [sidebarActive, setSidebarActive] = useState<boolean>(false);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<HomeFiltersType>({
    startDate: null,
    endDate: null,
    guests: "",
    minPrice: "",
    maxPrice: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchAll = async () => {
      try {
        const response = await disponibilidadeClient.get("/availability");
        const { rooms } = response.data;
        const allRooms: Listing[] = (Object.values(rooms) as any[]).map(
          (room) => ({
            id: room.id,
            name: room.name,
            address: room.address,
            comodities: room.comodities,
            pictures: room.pictures,
            price: room.price,
            capacity: room.capacity,
          })
        );
        setFilteredListings(allRooms);
      } catch (err) {
        console.error("Erro ao carregar todas as salas:", err);
      }
    };

    fetchAll();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startTs =
      filters.startDate !== null
        ? Math.floor(filters.startDate.getTime() / 1000)
        : undefined;
    const endTs =
      filters.endDate !== null
        ? Math.floor(filters.endDate.getTime() / 1000)
        : undefined;

    const params: Record<string, string | number> = {};
    if (startTs !== undefined) params.startDate = startTs;
    if (endTs !== undefined) params.endDate = endTs;
    if (searchQuery.trim() !== "") params.name = searchQuery.trim();

    try {
      const response = await disponibilidadeClient.get("/availability", {
        params,
      });
      const { rooms } = response.data;

      const availableRooms: Listing[] = (Object.values(rooms) as any[]).map(
        (room) => ({
          id: room.id,
          name: room.name,
          address: room.address,
          comodities: room.comodities,
          pictures: room.pictures,
          price: room.price,
          capacity: room.capacity,
        })
      );

      setFilteredListings(availableRooms);
    } catch (err) {
      console.error("Erro ao buscar disponibilidade:", err);
    }
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
