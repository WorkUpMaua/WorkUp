import React, { useEffect, useState } from 'react';
import HeaderBar from '../components/HeaderBar';
import SidebarMenu from '../components/SidebarMenu';
import RoomCard from '../components/RoomCard';
import PhotoGallery from '../components/workspace/PhotoGallery';
import Commodities from '../components/Commodities';
import { getCookie } from '../utils/cookies';
import { useNavigate } from 'react-router-dom';

interface RoomFormData {
  name: string;
  images: File[]; 
  price: string;
  address: string;
  amenities: string;
  capacity: string;
}

interface RoomFormErrors {
  [key: string]: string;
}

interface Room {
  id: string;
  name: string;
  images: string[]; 
  price: number;
  address: string;
  amenities: string[];
  capacity: number;
}

export default function CreatePropriedades() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    images: [],
    price: '',
    address: '',
    amenities: '',
    capacity: '',
  });
  const [errors, setErrors] = useState<RoomFormErrors>({});
  const [rooms, setRooms] = useState<Room[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === 'file' && files && files.length > 0) {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...fileArray], 
      }));
      setImagePreviews(prev => [
        ...prev,
        ...fileArray.map(file => URL.createObjectURL(file)),
      ]);
      if (errors.images) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.images;
          return newErrors;
        });
      }
    } else {
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
    }
  };

  const validateForm = (): boolean => {
    const newErrors: RoomFormErrors = {};
    if (!formData.name) newErrors.name = 'Nome da sala é obrigatório';
    if (!formData.images || formData.images.length === 0) newErrors.images = 'Pelo menos uma imagem é obrigatória';
    if (!formData.price || isNaN(Number(formData.price))) newErrors.price = 'Preço válido é obrigatório';
    if (!formData.address) newErrors.address = 'Endereço é obrigatório';
    if (!formData.capacity || isNaN(Number(formData.capacity)) || Number(formData.capacity) < 1) newErrors.capacity = 'Capacidade válida é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const imageUrls = imagePreviews; 
      const newRoom: Room = {
        id: Date.now().toString(),
        name: formData.name,
        images: imageUrls,
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
        images: [],
        price: '',
        address: '',
        amenities: '',
        capacity: '',
      });
      setImagePreviews([]);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  useEffect(() => {
      const token = getCookie('token')
      if(!token) navigate('/login')
    }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-light to-gray-100">
      <HeaderBar onMenuClick={() => setSidebarActive(true)} />
      <SidebarMenu active={sidebarActive} onClose={() => setSidebarActive(false)} />
      <main className="mt-20 p-10 w-full min-h-[calc(100vh-80px)] flex justify-center">
        <div className="w-full max-w-[1200px] mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-[#34495e] to-[#2c3e50]">
              <div className="flex items-center justify-center mb-4">
                <h1 className="text-3xl font-bold text-white text-center">Criar Nova Sala</h1>
              </div>
              <p className="text-gray-300 text-center max-w-2xl mx-auto">
                Cadastre seu espaço de trabalho com todas as informações necessárias para que os clientes possam encontrá-lo facilmente.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 animate-fade-in">
                  <span className="block sm:inline">{successMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Sala</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex: Sala de Reunião Executive"
                      className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)]`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço por Hora</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0,00"
                        className={`w-full border ${errors.price ? 'border-red-500' : 'border-gray-200'} rounded-lg pl-10 pr-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)]`}
                      />
                    </div>
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Ex: Av. Paulista, 1000 - São Paulo/SP"
                      className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)]`}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacidade</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      placeholder="Número de pessoas"
                      min={1}
                      className={`w-full border ${errors.capacity ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)]`}
                    />
                    {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comodidades</label>
                    <Commodities />
                  </div>

                  {imagePreviews.length === 0 ? null : (
                    <div className="relative mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adicionar mais fotos</label>
                      <label
                        htmlFor="image-upload"
                        className="w-full h-32 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition-all duration-300 cursor-pointer hover:bg-gray-100 group"
                      >
                        <input
                          id="image-upload"
                          type="file"
                          name="images"
                          accept="image/*"
                          multiple
                          onChange={handleChange}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 mb-2 text-gray-300 group-hover:text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-sm text-gray-500 font-medium group-hover:text-primary">Adicionar mais fotos</span>
                        </div>
                      </label>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {imagePreviews.length === 0 ? (
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fotos da Sala</label>
                      <label
                        htmlFor="image-upload"
                        className="w-full min-h-[300px] flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition-all duration-300 cursor-pointer hover:bg-gray-100 group"
                      >
                        <input
                          id="image-upload"
                          type="file"
                          name="images"
                          accept="image/*"
                          multiple
                          onChange={handleChange}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mb-4 text-gray-300 group-hover:text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-lg text-gray-500 font-medium group-hover:text-primary mb-2">Arraste suas fotos aqui</span>
                          <span className="text-sm text-gray-400">ou clique para selecionar</span>
                          <span className="text-xs text-gray-400 mt-2">Aceita múltiplas imagens</span>
                        </div>
                      </label>
                      {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">Fotos Selecionadas</label>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <PhotoGallery photos={imagePreviews} />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#34495e] text-white py-4 rounded-lg font-medium text-base transition-all duration-300 hover:bg-[#2c3e50] hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#34495e]"
                  >
                    Criar Sala
                  </button>
                </div>
              </div>
            </form>
          </div>

          {rooms.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-secondary mb-6">Salas Criadas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map(room => (
                  <div key={room.id} className="relative transform transition-all duration-300 hover:-translate-y-2">
                    <RoomCard
                      id={room.id}
                      imgPath={room.images[0] || ''}
                      name={room.name}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 shadow">
                      {room.capacity} pessoa{room.capacity > 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}