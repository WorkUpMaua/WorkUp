import React from 'react';
import PhotoGallery from '../components/PhotoGallery';

export default class Workspace extends React.Component {
    render() {
        const photoList: string[] = [
            'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg',
            'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg',
            'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg',
        ];

        return (
            <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Seção de Imagem */}
                <PhotoGallery photos={photoList} />

                {/* Seção de Conteúdo */}
                <div className="flex flex-col gap-6">
                    {/* Cabeçalho */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-800">Sala Comercial</h1>
                        <p className="text-gray-600">São Paulo, São Paulo</p>
                        <div className="flex gap-4 font-medium">
                            <span className="text-blue-600 cursor-pointer hover:text-blue-700">Detalhes</span>
                            <span className="text-blue-600 cursor-pointer hover:text-blue-700">Avaliações</span>
                        </div>
                    </div>

                    <hr className="border-t border-gray-200" />

                    {/* Descrição */}
                    <p className="text-gray-600 leading-relaxed">
                        Este espaço é perfeito para reuniões, workshops e eventos corporativos. Localizado no coração de São Paulo, oferece conforto e praticidade para atender às suas necessidades profissionais.
                    </p>

                    {/* Comodidades */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">Comodidades</h2>
                        <ul className="flex flex-wrap gap-3">
                            <li className="bg-gray-100 px-4 py-2 rounded-full text-gray-700">Lousa</li>
                            <li className="bg-gray-100 px-4 py-2 rounded-full text-gray-700">Copa</li>
                            <li className="bg-gray-100 px-4 py-2 rounded-full text-gray-700">Computadores</li>
                        </ul>
                    </div>

                    <hr className="border-t border-gray-200" />

                    {/* Preço e Botão */}
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-green-600">R$75,00</div>
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                            Reservar Agora
                        </button>
                    </div>
                </div>
            </div>
        );
    };
}