function handleSubmit(e: React.FormEvent): void {
  e.preventDefault();
}

export default function CatalogFilter() {
  return (
    <>
      <form id="searchForm" className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Pesquisar imóveis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input type="date" placeholder="Check-in" />
        <input type="date" placeholder="Check-out" />
        <input type="text" placeholder="Endereço" />
        <input type="number" placeholder="Pessoas" min={1} />
        <button type="submit">Buscar</button>
      </form>
    </>
  );
}
