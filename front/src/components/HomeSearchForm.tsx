import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css'; // ou outro tema de sua preferência
import React from 'react';
import { HomeFiltersType } from '../pages/Home';

interface HomeSearchFormProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filters: HomeFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<HomeFiltersType>>;
  onSubmit: (e: React.FormEvent) => void;
}

export default function HomeSearchForm({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  onSubmit,
}: HomeSearchFormProps) {
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev: HomeFiltersType) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8 w-full mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex flex-wrap gap-6 w-full">
        {/* Pesquisa */}
        <div className="relative flex-1 min-w-[200px]">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-text-gray"></i>
          <input
            type="text"
            id="searchQuery"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder=" "
            className="w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-text-dark shadow-sm transition-all duration-300 h-[50px] focus:border-primary focus:outline-none"
          />
          <label htmlFor="searchQuery" className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none text-text-gray transition-all duration-300 bg-white px-1.5 text-sm">
            Pesquisar imóveis
          </label>
        </div>
        {/* Check-in */}
        <div className="relative flex-1 min-w-[200px]">
          <i className="far fa-calendar-alt absolute left-4 top-1/2 -translate-y-1/2 text-text-gray z-[2] text-base"></i>
          <Flatpickr
            options={{ dateFormat: 'Y-m-d' }}
            value={filters.startDate}
            onChange={([date]) =>
              setFilters((prev) => ({
                ...prev,
                startDate: date ? (date as Date).toISOString().slice(0, 10) : '',
              }))
            }
            render={({ defaultValue, ...props }, ref) => (
              <input
                {...props}
                ref={ref}
                name="startDate"
                id="startDate"
                className="w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-text-dark shadow-sm transition-all duration-300 h-[50px] focus:border-primary focus:outline-none"
                placeholder="Check-in"
                autoComplete="off"
              />
            )}
          />
        </div>
        {/* Check-out */}
        <div className="relative flex-1 min-w-[200px]">
          <i className="far fa-calendar-alt absolute left-4 top-1/2 -translate-y-1/2 text-text-gray z-[2] text-base"></i>
          <Flatpickr
            options={{ dateFormat: 'Y-m-d' }}
            value={filters.endDate}
            onChange={([date]) =>
              setFilters((prev) => ({
                ...prev,
                endDate: date ? (date as Date).toISOString().slice(0, 10) : '',
              }))
            }
            render={({ defaultValue, ...props }, ref) => (
              <input
                {...props}
                ref={ref}
                name="endDate"
                id="endDate"
                className="w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-text-dark shadow-sm transition-all duration-300 h-[50px] focus:border-primary focus:outline-none"
                placeholder="Check-out"
                autoComplete="off"
              />
            )}
          />
        </div>
        {/* Pessoas */}
        <div className="relative flex-1 min-w-[200px]">
          <i className="fas fa-users absolute left-4 top-1/2 -translate-y-1/2 text-text-gray"></i>
          <input
            type="number"
            name="guests"
            id="guests"
            min={1}
            value={filters.guests}
            onChange={handleFilterChange}
            className="w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-text-dark shadow-sm transition-all duration-300 h-[50px] focus:border-primary focus:outline-none"
          />
          <label htmlFor="guests" className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none text-text-gray transition-all duration-300 bg-white px-1.5 text-sm">
            Pessoas
          </label>
        </div>
        {/* Preço mínimo */}
        <div className="relative flex-1 min-w-[200px]">
          <i className="fas fa-dollar-sign absolute left-4 top-1/2 -translate-y-1/2 text-text-gray"></i>
          <input
            type="number"
            name="minPrice"
            id="minPrice"
            placeholder=" "
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-text-dark shadow-sm transition-all duration-300 h-[50px] focus:border-primary focus:outline-none"
          />
          <label htmlFor="minPrice" className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none text-text-gray transition-all duration-300 bg-white px-1.5 text-sm">
            Preço mínimo
          </label>
        </div>
        {/* Preço máximo */}
        <div className="relative flex-1 min-w-[200px]">
          <i className="fas fa-dollar-sign absolute left-4 top-1/2 -translate-y-1/2 text-text-gray"></i>
          <input
            type="number"
            name="maxPrice"
            id="maxPrice"
            placeholder=" "
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-text-dark shadow-sm transition-all duration-300 h-[50px] focus:border-primary focus:outline-none"
          />
          <label htmlFor="maxPrice" className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none text-text-gray transition-all duration-300 bg-white px-1.5 text-sm">
            Preço máximo
          </label>
        </div>
      </div>
      <div className="flex w-full mt-6 justify-end">
        <button
          type="submit"
          className="bg-primary text-white border-none px-9 py-4 rounded-lg cursor-pointer font-semibold text-base transition-all duration-300 flex items-center gap-2.5 min-w-[200px] justify-center hover:bg-primary-dark hover:-translate-y-1 hover:shadow-lg"
        >
          <i className="fas fa-search"></i> Buscar
        </button>
      </div>
    </form>
  );
}