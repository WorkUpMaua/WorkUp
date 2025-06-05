import React from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";

export interface HomeFiltersType {
  startDate: Date | null;
  endDate: Date | null;
  guests: string | number;
  minPrice: string;
  maxPrice: string;
}

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
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-8 w-full mx-auto bg-white p-8 rounded-lg shadow-md"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="relative flex-1 min-w-[200px]">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-text-gray"></i>
          <input
            type="text"
            id="searchQuery"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder=" "
            className="peer w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-text-dark shadow-sm transition-all duration-300 h-[50px] focus:border-primary focus:outline-none"
          />
          <label
            htmlFor="searchQuery"
            className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none text-text-gray transition-all duration-300 bg-white px-1.5 text-sm peer-focus:opacity-0 peer-placeholder-shown:opacity-100 opacity-0"
          >
            Pesquisar imóveis
          </label>
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <i className="far fa-calendar-alt absolute left-4 top-1/2 -translate-y-1/2 text-text-gray z-[2] text-base"></i>
          <Flatpickr
            value={filters.startDate || undefined}
            options={{
              locale: Portuguese,
              enableTime: true,
              time_24hr: true,
              dateFormat: "d/m/Y - H:i",
              minDate: "today",
            }}
            onChange={([date]) =>
              setFilters(prev => ({
                ...prev,
                startDate: date || null,
                endDate:
                  prev.endDate && date && prev.endDate < date
                    ? null
                    : prev.endDate,
              }))
            }
            render={(props, ref) => (
              <input
                {...props}
                ref={ref}
                name="startDate"
                id="startDate"
                placeholder=" "
                autoComplete="off"
                className="peer w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-text-dark shadow-sm transition-all duration-300 h-[50px] focus:border-primary focus:outline-none"
              />
            )}
          />
          <label
            htmlFor="startDate"
            className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none text-text-gray transition-all duration-300 bg-white px-1.5 text-sm peer-focus:opacity-0 peer-placeholder-shown:opacity-100 opacity-0"
          >
            Check-in
          </label>
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <i className="far fa-calendar-alt absolute left-4 top-1/2 -translate-y-1/2 text-text-gray z-[2] text-base"></i>
          <Flatpickr
            value={filters.endDate || undefined}
            options={{
              locale: Portuguese,
              enableTime: true,
              time_24hr: true,
              dateFormat: "d/m/Y - H:i",
              minDate: filters.startDate || "today",
            }}
            onChange={([date]) =>
              setFilters(prev => ({
                ...prev,
                endDate: date || null,
              }))
            }
            render={(props, ref) => (
              <input
                {...props}
                ref={ref}
                name="endDate"
                id="endDate"
                placeholder=" "
                autoComplete="off"
                className="peer w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-text-dark shadow-sm transition-all duration-300 h-[50px] focus:border-primary focus:outline-none"
              />
            )}
          />
          <label
            htmlFor="endDate"
            className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none text-text-gray transition-all duration-300 bg-white px-1.5 text-sm peer-focus:opacity-0 peer-placeholder-shown:opacity-100 opacity-0"
          >
            Check-out
          </label>
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <i className="fas fa-users absolute left-4 top-1/2 -translate-y-1/2 text-text-gray"></i>
          <input
            type="number"
            name="guests"
            id="guests"
            value={filters.guests}
            min={1}
            onChange={e => {
              const val = e.target.value;
              setFilters(prev => ({
                ...prev,
                guests: val === "" ? "" : Math.max(1, Number(val)),
              }));
            }}
            placeholder=" "
            className="peer w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-text-dark shadow-sm transition-all duration-300 h-[50px] focus:border-primary focus:outline-none"
          />
          <label
            htmlFor="guests"
            className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none text-text-gray transition-all duration-300 bg-white px-1.5 text-sm peer-focus:opacity-0 peer-placeholder-shown:opacity-100 opacity-0"
          >
            Pessoas
          </label>
        </div>


        <div className="relative flex-1 min-w-[200px]">
          <i className="fas fa-dollar-sign absolute left-4 top-1/2 -translate-y-1/2 text-text-gray"></i>
          <input
            type="number"
            name="minPrice"
            id="minPrice"
            placeholder=" "
            value={filters.minPrice}
            min={1}
            onChange={handleFilterChange}
            className="peer w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-text-dark shadow-sm transition-all duration-300 h-[50px] focus:border-primary focus:outline-none"
          />
          <label
            htmlFor="minPrice"
            className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none text-text-gray transition-all duration-300 bg-white px-1.5 text-sm peer-focus:opacity-0 peer-placeholder-shown:opacity-100 opacity-0"
          >
            Preço mínimo
          </label>
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <i className="fas fa-dollar-sign absolute left-4 top-1/2 -translate-y-1/2 text-text-gray"></i>
          <input
            type="number"
            name="maxPrice"
            id="maxPrice"
            placeholder=" "
            value={filters.maxPrice}
            min={1}
            onChange={handleFilterChange}
            className="peer w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-text-dark shadow-sm transition-all duration-300 h-[50px] focus:border-primary focus:outline-none"
          />
          <label
            htmlFor="maxPrice"
            className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none text-text-gray transition-all duration-300 bg-white px-1.5 text-sm peer-focus:opacity-0 peer-placeholder-shown:opacity-100 opacity-0"
          >
            Preço máximo
          </label>
        </div>

        <div className="flex items-center justify-center col-span-1 md:col-span-3 mt-2">
          <button
            type="submit"
            className="bg-[#34495e] text-white border-none px-9 py-4 rounded-lg cursor-pointer font-semibold text-base transition-all duration-300 flex items-center gap-2.5 min-w-[200px] justify-center hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg"
          >
            <i className="fas fa-search"></i> Buscar
          </button>
        </div>
      </div>
    </form>
  );
}
