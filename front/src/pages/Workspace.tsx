// src/pages/Workspace.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import PhotoGallery from '../components/workspace/PhotoGallery';
import { Alert } from '../components/Alert';
import catalogoClient from '../utils/catalogoClient';

interface RoomDetails {
  id: string;
  name: string;
  address: string;
  comodities: string[];
  pictures: string[];
  price: number;
  capacity: number;
}

export default function Workspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiAlert, setApiAlert] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    if (!id) {
      setApiAlert({ message: 'ID de sala inválido.', type: 'error' });
      setLoading(false);
      return;
    }

    const fetchRoom = async () => {
      try {
        const response = await catalogoClient.get(`/catalogo/${id}`);
        const data = response.data as RoomDetails;
        setRoom(data);
      } catch (err: unknown) {
        let messageFromBack = 'Não foi possível carregar detalhes da sala.';
        if (err && typeof err === 'object' && 'response' in err) {
          // @ts-ignore
          const axiosErr = err;
          // @ts-ignore
          if (axiosErr.response?.data && typeof axiosErr.response.data === 'object') {
            // @ts-ignore
            messageFromBack = (axiosErr.response.data as { message?: string }).message || messageFromBack;
          }
        }
        setApiAlert({ message: `ERRO: ${messageFromBack}`, type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-light to-gray-100 flex justify-center">
      <div className="w-full max-w-6xl p-4">
        {/* Botão “Voltar” */}
        <div className="mb-4">
          <BackButton onClick={() => navigate(-1)} />
        </div>

        {/* Alerta de erro/sucesso */}
        {apiAlert && (
          <div className="max-w-md m-auto mt-4">
            <Alert
              message={apiAlert.message}
              type={apiAlert.type}
              onClose={() => setApiAlert(null)}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center mt-10 text-gray-600">Carregando detalhes...</div>
        ) : !room ? null : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <PhotoGallery photos={room.pictures} />
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{room.name}</h1>
                <p className="text-gray-600 text-sm mt-2 flex items-center gap-1.5">
                  <i className="fas fa-map-marker-alt text-primary"></i>
                  {room.address}
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Comodidades</h2>
                <ul className="flex flex-wrap gap-3">
                  {room.comodities.map((amenity, idx) => (
                    <li
                      key={idx}
                      className="bg-gray-100 px-4 py-2 rounded-full text-gray-700"
                    >
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
              <hr className="border-t border-gray-200" />
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-green-600">
                  R$ {room.price.toLocaleString('pt-BR')},00
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Reservar Agora
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
