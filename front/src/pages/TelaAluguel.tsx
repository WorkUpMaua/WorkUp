import { useState } from 'react';
import type { JSX } from 'react';
import HeaderBar from '../components/HeaderBar';
import SidebarMenu from '../components/SidebarMenu';

interface Reservation {
  id: string;
  workspaceId: string;
  workspaceName: string;
  workspaceImage: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
}

// Temporary mock data - this should be replaced with actual API calls
const mockReservations: Reservation[] = [
  {
    id: '1',
    workspaceId: '1',
    workspaceName: 'Escritório Moderno no Centro',
    workspaceImage: 'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg',
    startDate: '2025-05-20',
    endDate: '2025-03-31',
    status: 'active'
  },
  {
    id: '2',
    workspaceId: '2',
    workspaceName: 'Sala Comercial Premium',
    workspaceImage: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg',
    startDate: '2024-04-01',
    endDate: '2024-04-05',
    status: 'active'
  },
  {
    id: '3',
    workspaceId: '3',
    workspaceName: 'Sala Comercial Premium',
    workspaceImage: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg',
    startDate: '2024-04-01',
    endDate: '2024-04-05',
    status: 'active'
  }
];

export default function TelaAluguel(): JSX.Element {
  const [sidebarActive, setSidebarActive] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Reservation['status']) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'completed':
        return 'Concluída';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const handleMenuClick = () => {
    setSidebarActive(true);
  };

  const handleSidebarClose = () => {
    setSidebarActive(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-light to-gray-100">
      <HeaderBar onMenuClick={handleMenuClick} />
      <SidebarMenu active={sidebarActive} onClose={handleSidebarClose} />

      <main className="mt-20 p-10 w-full min-h-[calc(100vh-80px)] flex justify-center">
        <div className="w-full max-w-[1200px] mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-[#34495e] to-[#2c3e50]">
              <div className="flex items-center justify-center mb-4">
                <h1 className="text-3xl font-bold text-white text-center">Minhas Reservas</h1>
              </div>
            </div>

            <div className="p-8">
              <section className={`grid gap-8 ${
                mockReservations.length < 3 
                  ? 'grid-cols-1 md:grid-cols-2 place-items-center justify-center' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {mockReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 w-full max-w-[450px]"
                  >
                    <img
                      src={reservation.workspaceImage}
                      alt={reservation.workspaceName}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {reservation.workspaceName}
                      </h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Check-in:</span>
                          <span className="font-medium">{formatDate(reservation.startDate)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Check-out:</span>
                          <span className="font-medium">{formatDate(reservation.endDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            reservation.status
                          )}`}
                        >
                          {getStatusText(reservation.status)}
                        </span>
                        <button
                          onClick={() => {/* Implement cancellation logic */}}
                          className="cursor-pointer text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-300"
                        >
                          Cancelar reserva
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {mockReservations.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-text-gray">Você ainda não possui reservas.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
