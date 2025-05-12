import React from 'react';
import BackButton from '../components/BackButton';
import PhotoGallery from '../components/workspace/PhotoGallery';
import HeaderWorkspace from '../components/workspace/HeaderWorkspace';
import ReviewCard from '../components/workspace/ReviewCard';

type WorkspaceState = {
    selectedTab: string;
}


export default class Workspace extends React.Component {
    state: WorkspaceState = {
        selectedTab: 'Detalhes'

    }

    handleTabClick = (tab: string) => {
        this.setState({ selectedTab: tab });
    };

    renderContent = () => {
        const { selectedTab } = this.state;

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
                        userImage="https://randomuser.me/api/portraits/women/44.jpg" // ou outra imagem fake
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

    render() {
        const photoList: string[] = [
            'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg',
            'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg',
            'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg',
        ];

        return (
            <div className="max-w-6xl mx-auto p-4">
                {/* Botão de Voltar */}
                <BackButton />

                {/* Conteúdo principal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    {/* Seção de Imagem */}
                    <PhotoGallery photos={photoList} />

                    {/* Seção de Conteúdo */}
                    <div className="flex flex-col gap-6">
                        {/* Cabeçalho */}
                        <HeaderWorkspace
                            title="Sala Comercial"
                            location="São Paulo, São Paulo"
                            tabs={['Detalhes', 'Avaliações']}
                            activeTab={this.state.selectedTab}
                            onTabClick={this.handleTabClick}
                        />

                        <hr className="border-t border-gray-200" />

                        {/* Conteúdo de acordo com a aba */}
                        {this.renderContent()}

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
            </div>
        );
    };
}