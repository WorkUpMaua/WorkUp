export type Property = {
  id: string;
  title: string;
  image: string;
  address: string;
  price: number;
  period: string;
  status: "active" | "past";
  publishedAt: string;
  amenities: string[];
  photos: string[];
  location: string;
};

export const properties: Property[] = [
  {
    id: "1",
    title: "Sala Comercial Premium",
    image: "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg",
    address: "Rua Oscar Freire, 2000 - São Paulo/SP",
    price: 1800,
    period: "Jan/2024 - Mar/2024",
    status: "past",
    publishedAt: "2023-12-10",
    amenities: ["Wi-Fi", "Ar Condicionado", "Recepção 24h"],
    photos: [
      "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg",
      "https://images.pexels.com/photos/380770/pexels-photo-380770.jpeg",
    ],
    location: "Rua Oscar Freire, 2000 - São Paulo/SP",
  },
  {
    id: "2",
    title: "Coworking Espaçoso",
    image: "https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg",
    address: "Alameda Santos, 500 - São Paulo/SP",
    price: 900,
    period: "Abr/2024 - Atual",
    status: "active",
    publishedAt: "2024-03-15",
    amenities: ["Café Grátis", "Salas de Reunião", "Estacionamento"],
    photos: [
      "https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg",
      "https://images.pexels.com/photos/267508/pexels-photo-267508.jpeg",
    ],
    location: "Alameda Santos, 500 - São Paulo/SP",
  },
  {
    id: "3",
    title: "Escritório Moderno no Centro",
    image: "https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg",
    address: "Av. Paulista, 1000 - São Paulo/SP",
    price: 1200,
    period: "Fev/2023 - Dez/2023",
    status: "past",
    publishedAt: "2023-01-20",
    amenities: ["Internet Rápida", "Mobiliado", "Limpeza Inclusa"],
    photos: [
      "https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg",
      "https://images.pexels.com/photos/380771/pexels-photo-380771.jpeg",
    ],
    location: "Av. Paulista, 1000 - São Paulo/SP",
  },
  {
    id: "4",
    title: "Escritório com Vista",
    image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg",
    address: "Brooklin Novo, 300 - São Paulo/SP",
    price: 2500,
    period: "Mai/2024 - Atual",
    status: "active",
    publishedAt: "2024-04-01",
    amenities: ["Vista para o Parque", "Varanda", "Ar Condicionado"],
    photos: [
      "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg",
      "https://images.pexels.com/photos/1181407/pexels-photo-1181407.jpeg",
    ],
    location: "Brooklin Novo, 300 - São Paulo/SP",
  },
];

// Helper function to adapt properties for ListingCard
export function propertyToListing(property: Property) {
  return {
    id: property.id,
    title: property.title,
    image: property.image,
    price: property.price,
    address: property.address,
    amenities: [
      property.period,
      `Publicado em: ${new Date(property.publishedAt).toLocaleDateString("pt-BR")}`,
    ],
  };
}