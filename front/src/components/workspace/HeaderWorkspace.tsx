interface HeaderWorkspaceProps {
    title: string;
    location: string;
    tabs?: string[];
    activeTab: string;
    onTabClick: (tab: string) => void; // Função chamada ao clicar em uma aba
}

export default function HeaderWorkspace(props: HeaderWorkspaceProps) {
    const defaultTabs = ['Detalhes', 'Avaliações'];
    const tabsToDisplay = props.tabs?.length ? props.tabs : defaultTabs;

    return (
        <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">{props.title}</h1>
            <p className="text-gray-600">{props.location}</p>
            {tabsToDisplay.length > 0 && (
                <div className="flex gap-4 font-medium">
                    {tabsToDisplay.map((tab, index) => (
                        <button
                            key={index}
                            className={`cursor-pointer bg-transparent border-none p-0 m-0 ${props.activeTab === tab
                                ? 'text-blue-800 font-bold'
                                : 'text-blue-600 hover:text-blue-700'
                                }`}
                            onClick={() => props.onTabClick(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
