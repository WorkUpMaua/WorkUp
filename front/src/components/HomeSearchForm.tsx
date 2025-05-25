import React, { useState } from 'react';

// Simulando os tipos para o exemplo
interface HomeFiltersType {
  startDate: string;
  endDate: string;
  guests: number;
  minPrice: number;
  maxPrice: number;
}

export default function HomeSearchForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<HomeFiltersType>({
    startDate: '',
    endDate: '',
    guests: 1,
    minPrice: 0,
    maxPrice: 0
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev: HomeFiltersType) => ({
      ...prev,
      [name]: name === 'guests' || name === 'minPrice' || name === 'maxPrice' ? Number(value) : value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Busca realizada!', { searchQuery, filters });
  };

  return (
    <div className="flex flex-col gap-8 w-full mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Pesquisa */}
        <div className="relative">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            id="searchQuery"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder=" "
            className="w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-gray-800 shadow-sm transition-all duration-300 h-[50px] focus:border-blue-500 focus:outline-none"
          />
          <label htmlFor="searchQuery" className={`absolute transition-all duration-300 bg-white px-1.5 pointer-events-none ${
            searchQuery ? 'top-0 left-2 text-xs text-blue-500' : 'top-1/2 left-10 -translate-y-1/2 text-sm text-gray-400'
          }`}>
            Pesquisar imóveis
          </label>
        </div>

        {/* Check-in */}
        <div className="relative">
          <i className="far fa-calendar-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-[2] text-base"></i>
          <input
            type="date"
            name="startDate"
            id="startDate"
            value={filters.startDate}
            onChange={(e) => setFilters(prev => ({...prev, startDate: e.target.value}))}
            className="w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-gray-800 shadow-sm transition-all duration-300 h-[50px] focus:border-blue-500 focus:outline-none"
            placeholder="Check-in"
          />
        </div>

        {/* Check-out */}
        <div className="relative">
          <i className="far fa-calendar-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-[2] text-base"></i>
          <input
            type="date"
            name="endDate"
            id="endDate"
            value={filters.endDate}
            onChange={(e) => setFilters(prev => ({...prev, endDate: e.target.value}))}
            className="w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-gray-800 shadow-sm transition-all duration-300 h-[50px] focus:border-blue-500 focus:outline-none"
            placeholder="Check-out"
          />
        </div>

        {/* Pessoas */}
        <div className="relative">
          <i className="fas fa-users absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="number"
            name="guests"
            id="guests"
            min={1}
            value={filters.guests}
            onChange={handleFilterChange}
            className="w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-gray-800 shadow-sm transition-all duration-300 h-[50px] focus:border-blue-500 focus:outline-none"
          />
          <label htmlFor="guests" className={`absolute transition-all duration-300 bg-white px-1.5 pointer-events-none ${
            filters.guests > 0 ? 'top-0 left-2 text-xs text-blue-500' : 'top-1/2 left-10 -translate-y-1/2 text-sm text-gray-400'
          }`}>
            Pessoas
          </label>
        </div>

        {/* Preço mínimo */}
        <div className="relative">
          <i className="fas fa-dollar-sign absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="number"
            name="minPrice"
            id="minPrice"
            placeholder=" "
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-gray-800 shadow-sm transition-all duration-300 h-[50px] focus:border-blue-500 focus:outline-none"
          />
          <label htmlFor="minPrice" className={`absolute transition-all duration-300 bg-white px-1.5 pointer-events-none ${
            filters.minPrice > 0 ? 'top-0 left-2 text-xs text-blue-500' : 'top-1/2 left-10 -translate-y-1/2 text-sm text-gray-400'
          }`}>
            Preço mínimo
          </label>
        </div>

        {/* Preço máximo */}
        <div className="relative">
          <i className="fas fa-dollar-sign absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="number"
            name="maxPrice"
            id="maxPrice"
            placeholder=" "
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-gray-800 shadow-sm transition-all duration-300 h-[50px] focus:border-blue-500 focus:outline-none"
          />
          <label htmlFor="maxPrice" className={`absolute transition-all duration-300 bg-white px-1.5 pointer-events-none ${
            filters.maxPrice > 0 ? 'top-0 left-2 text-xs text-blue-500' : 'top-1/2 left-10 -translate-y-1/2 text-sm text-gray-400'
          }`}>
            Preço máximo
          </label>
        </div>
      </div>
      
      {/* Botão Buscar */}
        <div className="flex justify-center w-full mt-4">
        <button
          type="button"
          onClick={onSubmit}
          className="bg-blue-600 text-white border-none px-9 py-4 rounded-lg cursor-pointer font-semibold text-base transition-all duration-300 flex items-center gap-2.5 min-w-[200px] justify-center hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg"
        >
          <i className="fas fa-search"></i> Buscar
        </button>
      </div>
    </div>
  );
}