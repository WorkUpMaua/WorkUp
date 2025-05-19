import React from 'react';

interface HomeSearchFormProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filters: any;
  setFilters: (filters: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function HomeSearchForm({ searchQuery, setSearchQuery, filters, setFilters, onSubmit }: HomeSearchFormProps) {
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 w-full mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex flex-wrap gap-5 w-full">
        <div className="relative flex-1 min-w-[200px]">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-text-gray"></i>
          <input
            type="text"
            id="searchQuery"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder=" "
            className="w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-text-dark shadow-sm transition-all duration-300 h-[50px] focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)]"
          />
          <label htmlFor="searchQuery" className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none text-text-gray transition-all duration-300 bg-white px-1.5 text-sm">Pesquisar imóveis</label>
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <button type="button" className="absolute left-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-text-gray z-[2] text-base cursor-pointer">
            <i className="far fa-calendar-alt"></i>
          </button>
          <input
            type="date"
            name="startDate"
            id="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-text-dark shadow-sm transition-all duration-300 h-[50px] focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)]"
          />
          <label htmlFor="startDate" className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none text-text-gray transition-all duration-300 bg-white px-1.5 text-sm">Check-in</label>
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <button type="button" className="absolute left-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-text-gray z-[2] text-base cursor-pointer">
            <i className="far fa-calendar-alt"></i>
          </button>
          <input
            type="date"
            name="endDate"
            id="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-text-dark shadow-sm transition-all duration-300 h-[50px] focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)]"
          />
          <label htmlFor="endDate" className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none text-text-gray transition-all duration-300 bg-white px-1.5 text-sm">Check-out</label>
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <i className="fas fa-users absolute left-4 top-1/2 -translate-y-1/2 text-text-gray"></i>
          <input
            type="number"
            name="guests"
            id="guests"
            min={1}
            value={filters.guests}
            onChange={handleFilterChange}
            className="w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-text-dark shadow-sm transition-all duration-300 h-[50px] focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)]"
          />
          <label htmlFor="guests" className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none text-text-gray transition-all duration-300 bg-white px-1.5 text-sm">Pessoas</label>
        </div>
      </div>
      <div className="flex flex-wrap gap-5 w-full items-center">
        <div className="flex items-center gap-4 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <i className="fas fa-dollar-sign absolute left-4 top-1/2 -translate-y-1/2 text-text-gray"></i>
            <input
              type="number"
              name="minPrice"
              id="minPrice"
              placeholder=" "
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-text-dark shadow-sm transition-all duration-300 h-[50px] focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)]"
            />
            <label htmlFor="minPrice" className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none text-text-gray transition-all duration-300 bg-white px-1.5 text-sm">Preço mínimo</label>
          </div>
          <span className="text-text-gray text-sm whitespace-nowrap">até</span>
          <div className="relative flex-1">
            <i className="fas fa-dollar-sign absolute left-4 top-1/2 -translate-y-1/2 text-text-gray"></i>
            <input
              type="number"
              name="maxPrice"
              id="maxPrice"
              placeholder=" "
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="w-full border border-gray-200 rounded-lg px-10 py-4 bg-white text-base text-text-dark shadow-sm transition-all duration-300 h-[50px] focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)]"
            />
            <label htmlFor="maxPrice" className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none text-text-gray transition-all duration-300 bg-white px-1.5 text-sm">Preço máximo</label>
          </div>
        </div>
        <button type="submit" className="bg-primary text-white border-none px-9 py-4 rounded-lg cursor-pointer font-semibold text-base transition-all duration-300 flex items-center gap-2.5 min-w-[200px] justify-center hover:bg-primary-dark hover:-translate-y-1 hover:shadow-lg">
          <i className="fas fa-search"></i> Buscar
        </button>
      </div>
    </form>
  );
}