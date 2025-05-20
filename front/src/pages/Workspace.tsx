import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import PhotoGallery from '../components/workspace/PhotoGallery';
import HeaderWorkspace from '../components/workspace/HeaderWorkspace';
import ReviewCard from '../components/workspace/ReviewCard';

const workspaceData = [
  {
    id: '1',
    title: 'Escritório Moderno no Centro',
    location: 'Av. Paulista, 1000 - São Paulo/SP',
    photos: [
      'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg',
      'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg',
      'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg',
    ],
    price: 1200,
    amenities: ['Wi-Fi', 'Ar Condicionado', 'Cozinha'],
  },
  {
    id: '2',
    title: 'Sala Comercial Premium',
    location: 'Rua Oscar Freire, 2000 - São Paulo/SP',
    photos: [
      'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg',
      'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg',
      'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg',
    ],
    price: 1800,
    amenities: ['Wi-Fi', 'Ar Condicionado', 'Estacionamento'],
  },
  // ... outros espaços
];

export default function Workspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = React.useState('Detalhes');

  const workspace = workspaceData.find((w) => w.id === id);

  if (!workspace) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="text-center text-xl mt-10">Espaço não encontrado.</div>
      </div>
    );
  }

  const renderContent = () => {
    if (selectedTab === 'Detalhes') {
      return (
        <p className="text-gray-600 leading-relaxed">
          Este espaço é perfeito para reuniões, workshops e eventos corporativos. Localizado no coração de São Paulo, oferece conforto e praticidade para atender às suas necessidades profissionais.
        </p>
      );
    } else if (selectedTab === 'Avaliações') {
      return (
        <div className="space-y-4">
          <ReviewCard
            userName="Lucas Milani"
            userImage="https://randomuser.me/api/portraits/women/44.jpg"
            rating={5}
            daysAgo="2 semanas atrás"
            stayDuration="Utilizou por uma semana"
            comment="Bem aconchegante e ótima localização 😊"
          />
          <ReviewCard
            userName="Luketa Milanesa"
            userImage="https://randomuser.me/api/portraits/men/32.jpg"
            rating={4}
            daysAgo="3 dias atrás"
            stayDuration="Utilizou por um dia"
            comment="Espaço confortável e excelente para mentes criativas!"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <BackButton onClick={() => navigate(-1)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <PhotoGallery photos={workspace.photos} />
        <div className="flex flex-col gap-6">
          <HeaderWorkspace
            title={workspace.title}
            location={workspace.location}
            tabs={['Detalhes', 'Avaliações']}
            activeTab={selectedTab}
            onTabClick={setSelectedTab}
          />
          <hr className="border-t border-gray-200" />
          {renderContent()}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Comodidades</h2>
            <ul className="flex flex-wrap gap-3">
              {workspace.amenities.map((amenity, idx) => (
                <li key={idx} className="bg-gray-100 px-4 py-2 rounded-full text-gray-700">{amenity}</li>
              ))}
            </ul>
          </div>
          <hr className="border-t border-gray-200" />
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-green-600">R$ {workspace.price.toLocaleString('pt-BR')},00</div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Reservar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}