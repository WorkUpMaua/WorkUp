import React, { useState } from 'react';
import HeaderBar from '../components/HeaderBar';
import SidebarMenu from '../components/SidebarMenu';
import RoomCard from '../components/RoomCard';

interface RoomFormData {
  name: string;
  image: string;
  price: string;
  address: string;
  amenities: string;
  capacity: string; // novo campo
}

interface RoomFormErrors {
  [key: string]: string;
}

interface Room {
  id: string;
  name: string;
  image: string;
  price: number;
  address: string;
  amenities: string[];
  capacity: number; // novo campo
}

export default function CreatePropriedades() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    image: '',
    price: '',
    address: '',
    amenities: '',
    capacity: '', // novo campo
  });
  const [errors, setErrors] = useState<RoomFormErrors>({});
  const [rooms, setRooms] = useState<Room[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: RoomFormErrors = {};
    if (!formData.name) newErrors.name = 'Nome da sala é obrigatório';
    if (!formData.image) newErrors.image = 'URL da imagem é obrigatória';
    if (!formData.price || isNaN(Number(formData.price))) newErrors.price = 'Preço válido é obrigatório';
    if (!formData.address) newErrors.address = 'Endereço é obrigatório';
    if (!formData.capacity || isNaN(Number(formData.capacity)) || Number(formData.capacity) < 1) newErrors.capacity = 'Capacidade válida é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const newRoom: Room = {
        id: Date.now().toString(),
        name: formData.name,
        image: formData.image,
        price: Number(formData.price),
        address: formData.address,
        amenities: formData.amenities
          ? formData.amenities.split(',').map(a => a.trim()).filter(Boolean)
          : [],
        capacity: Number(formData.capacity),
      };
      setRooms(prev => [...prev, newRoom]);
      setSuccessMessage('Sala criada com sucesso!');
      setFormData({
        name: '',
        image: '',
        price: '',
        address: '',
        amenities: '',
        capacity: '',
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-light to-gray-100">
      <HeaderBar onMenuClick={() => setSidebarActive(true)} />
      <SidebarMenu active={sidebarActive} onClose={() => setSidebarActive(false)} />
      <main className="mt-20 p-10 w-full min-h-[calc(100vh-80px)] flex justify-center">
        <div className="w-full max-w-[1000px] mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-center justify-center mb-6">
                <h1 className="text-3xl font-bold text-secondary text-center">Criar Nova Sala</h1>
              </div>
              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 animate-fade-in">
                  <span className="block sm:inline">{successMessage}</span>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nome da sala"
                      className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)]`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="URL da imagem"
                      className={`w-full border ${errors.image ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)]`}
                    />
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Preço por dia (R$)"
                      className={`w-full border ${errors.price ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)]`}
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Endereço"
                      className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)]`}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="amenities"
                      value={formData.amenities}
                      onChange={handleChange}
                      placeholder="Comodidades (separadas por vírgula)"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)]"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      placeholder="Capacidade (nº de pessoas)"
                      min={1}
                      className={`w-full border ${errors.capacity ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)]`}
                    />
                    {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Pré-visualização"
                      className="w-full h-60 object-cover rounded-lg border border-gray-200 mb-4"
                    />
                  ) : (
                    <div className="w-full h-60 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200 text-gray-400 mb-4">
                      Pré-visualização da imagem
                    </div>
                  )}
                  <button
                    type="submit"
                    className="bg-primary text-white border-none px-8 py-3 rounded-lg cursor-pointer font-medium text-base transition-all duration-300 hover:bg-primary-dark hover:-translate-y-0.5 w-full"
                  >
                    Criar Sala
                  </button>
                </div>
              </div>
            </form>
            {rooms.length > 0 && (
              <div className="p-8 border-t border-gray-200">
                <h2 className="text-2xl font-semibold text-secondary mb-6">Salas Criadas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rooms.map(room => (
                    <div key={room.id} className="relative">
                      <RoomCard
                        id={room.id}
                        imgPath={room.image}
                        name={room.name}
                      />
                      <div className="absolute top-4 left-4 bg-white/90 rounded px-3 py-1 text-xs font-semibold text-gray-700 shadow">
                        {room.capacity} pessoa{room.capacity > 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}