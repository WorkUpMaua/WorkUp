import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo_WorkUp.png';
import Notificacao from '../assets/icon_notificacao.png';

interface Listing {
  id: string;
  title: string;
  image: string;
  price: number;
  address: string;
  amenities: string[];
}

const listingsData: Listing[] = [
  { 
    id: '1',
    title: 'Escritório Moderno no Centro', 
    image: 'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg',
    price: 1200,
    address: 'Av. Paulista, 1000 - São Paulo/SP',
    amenities: ['Wi-Fi', 'Ar Condicionado', 'Cozinha']
  },
  { 
    id: '2',
    title: 'Sala Comercial Premium', 
    image: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg',
    price: 1800,
    address: 'Rua Oscar Freire, 2000 - São Paulo/SP',
    amenities: ['Wi-Fi', 'Ar Condicionado', 'Estacionamento']
  },
  { 
    id: '3',
    title: 'Coworking Espaçoso', 
    image: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg',
    price: 900,
    address: 'Alameda Santos, 500 - São Paulo/SP',
    amenities: ['Wi-Fi', 'Cafeteria', 'Sala de Reuniões']
  },
  { 
    id: '4',
    title: 'Escritório com Vista', 
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
    price: 2500,
    address: 'Brooklin Novo, 300 - São Paulo/SP',
    amenities: ['Wi-Fi', 'Ar Condicionado', 'Varanda', 'Limpeza Diária']
  }
];

function Home(): React.ReactElement {
  const [sidebarActive, setSidebarActive] = useState<boolean>(false);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredListings, setFilteredListings] = useState<Listing[]>(listingsData);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    address: '',
    guests: 1,
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = '';
    };
  }, []);

  useEffect(() => {
    const results = listingsData.filter((listing) => {
      const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          listing.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPrice = (!filters.minPrice || listing.price >= Number(filters.minPrice)) &&
                         (!filters.maxPrice || listing.price <= Number(filters.maxPrice));
      
      return matchesSearch && matchesPrice;
    });
    
    setFilteredListings(results);
  }, [searchQuery, filters]);

  const toggleSidebar = (): void => {
    setSidebarActive(!sidebarActive);
    setShowOverlay(!sidebarActive);
  };

  const closeSidebar = (): void => {
    setSidebarActive(false);
    setShowOverlay(false);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-light to-gray-100">
      {showOverlay && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity" onClick={closeSidebar}></div>
      )}

      <div className={`fixed top-0 left-0 w-[280px] h-full bg-secondary text-white py-5 -translate-x-full transition-transform duration-300 z-50 shadow-lg flex flex-col ${sidebarActive ? 'translate-x-0' : ''}`}>
        <div className="p-5 text-center border-b border-white/10 mb-5">
          <h2 className="text-2xl font-semibold">WorkUp</h2>
        </div>
        <ul className="flex-grow">
          <li className="px-6 py-4 cursor-pointer transition-all duration-300 flex items-center gap-4 text-sm hover:bg-white/10 hover:pl-8">
            <i className="fas fa-home w-5 text-center"></i> Dashboard
          </li>
          <li className="px-6 py-4 cursor-pointer transition-all duration-300 flex items-center gap-4 text-sm hover:bg-white/10 hover:pl-8">
            <i className="fas fa-user w-5 text-center"></i> Perfil
          </li>
          <li className="px-6 py-4 cursor-pointer transition-all duration-300 flex items-center gap-4 text-sm hover:bg-white/10 hover:pl-8">
            <i className="fas fa-cog w-5 text-center"></i> Configurações
          </li>
          <li className="px-6 py-4 cursor-pointer transition-all duration-300 flex items-center gap-4 text-sm hover:bg-white/10 hover:pl-8">
            <i className="fas fa-sign-out-alt w-5 text-center"></i> Sair
          </li>
        </ul>
      </div>

      <div className="min-h-screen bg-transparent transition-all duration-300">
        <header className="fixed top-0 left-0 w-full h-20 bg-primary text-white flex items-center justify-between px-8 z-40 shadow-md">
          <div className="flex items-center">
            <button 
              className="flex items-center gap-2.5 text-base bg-white/20 border-none cursor-pointer transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/30"
              onClick={toggleSidebar}
            >
              <i className="fas fa-bars"></i>
              <span className="font-medium md:inline hidden">Menu</span>
            </button>
          </div>

          <div className="flex items-center justify-center">
            <img src={Logo} alt="WorkUp Logo" className="h-11 filter brightness-0 invert" />
          </div>

          <div className="flex items-center justify-end gap-6">
            <div className="relative cursor-pointer">
              <img src={Notificacao} alt="Notificações" className="w-6 h-6 filter brightness-0 invert" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-[18px] h-[18px] flex items-center justify-center text-xs font-bold">3</span>
            </div>
            <Link to="/user-profile" className="flex items-center gap-2.5 no-underline text-white">
              <img
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                alt="Usuário"
                className="w-6 h-6 rounded-full border-2 border-white"
              />
              <span className="text-sm font-medium md:inline hidden">Olá, Usuário</span>
            </Link>
          </div>
        </header>

        <main className="mt-20 p-10 w-full min-h-[calc(100vh-80px)] flex justify-center">
          <div className="w-full max-w-[1600px] mx-auto flex flex-col items-center">
            <div className="w-full mb-10 text-center">
              <h1 className="text-4xl text-secondary mb-4 font-bold">Encontre o espaço perfeito para seu negócio</h1>
              <p className="text-lg text-text-gray mb-8 max-w-[700px] mx-auto">Descubra escritórios e salas comerciais que combinam com sua necessidade</p>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full mx-auto bg-white p-8 rounded-lg shadow-md">
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
            </div>

            <div className="w-full">
              <h2 className="text-3xl text-secondary mb-8 font-semibold text-center">Espaços disponíveis</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
                {filteredListings.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 flex flex-col relative hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative w-full h-[220px] overflow-hidden">
                      <img src={listing.image} alt={listing.title} className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105" />
                      <span className="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-full font-bold text-sm z-[1]">
                        R$ {listing.price.toLocaleString('pt-BR')}/dia
                      </span>
                      <button className="absolute top-4 right-4 bg-white text-text-gray border-none w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-[1] hover:text-red-500 hover:scale-110">
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
                      <button className="mt-auto bg-transparent border border-primary text-primary px-4 py-2.5 rounded-lg cursor-pointer font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:bg-primary hover:text-white hover:-translate-y-0.5">
                        Ver detalhes <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home; 