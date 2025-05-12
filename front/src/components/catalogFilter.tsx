type CatalogFilterProps = {
  searchQuery: string;
  setSearchQuery: (data: string) => void;
};

function handleSubmit(e: React.FormEvent): void {
  e.preventDefault();
}

export default function CatalogFilter(props: CatalogFilterProps) {
  return (
      <form
        id="searchForm"
        className="flex flex-wrap gap-4 justify-center items-center my-10 w-full max-w-9/10"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="border-none rounded-lg  py-3.5 bg-white w-56 shadow-md text-center"
          placeholder="Pesquisar imóveis..."
          value={props.searchQuery}
          onChange={(e) => props.setSearchQuery(e.target.value)}
        />
        <input type="date" placeholder="Check-in" className="border-none rounded-lg  py-3.5 bg-white w-56 shadow-md text-center" />
        <input type="date" placeholder="Check-out" className="border-none rounded-lg  py-3.5 bg-white w-56 shadow-md text-center" />
        <input type="text" placeholder="Endereço" className="border-none rounded-lg  py-3.5 bg-white w-56 shadow-md text-center" />
        <input type="number" placeholder="Pessoas" min={1} className="border-none rounded-lg  py-3.5 bg-white w-56 shadow-md text-center" />
        <button type="submit" className="bg-[#34495e] text-white border-none py-3.5 px-8 rounded-lg cursor-pointer font-bold text-md transition duration-75 hover:scale-110 ">Buscar</button>
      </form>
  );
}
