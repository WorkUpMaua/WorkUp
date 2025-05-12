interface HeaderWorkspaceProps {
    title: string;
    location: string;
    tabs?: string[];
    activeTab: string;
    onTabClick: (tab: string) => void; // Função chamada ao clicar em uma aba
}

export default function HeaderWorkspace({ title, location, tabs, activeTab, onTabClick }: HeaderWorkspaceProps) {
    const defaultTabs = ['Detalhes', 'Avaliações'];
    const tabsToDisplay = tabs?.length ? tabs : defaultTabs;

    return (
        <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            <p className="text-gray-600">{location}</p>
            {tabsToDisplay.length > 0 && (
                <div className="flex gap-4 font-medium">
                    {tabsToDisplay.map((tab, index) => (
                        <button
                            key={index}
                            className={`cursor-pointer bg-transparent border-none p-0 m-0 ${activeTab === tab
                                ? 'text-blue-800 font-bold'
                                : 'text-blue-600 hover:text-blue-700'
                                }`}
                            onClick={() => onTabClick(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
