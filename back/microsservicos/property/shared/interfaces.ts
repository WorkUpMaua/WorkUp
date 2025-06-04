export interface PropertyRelation {
  id: string;
  userId: string;
  catalogId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnifiedCatalog {
  id: string;
  name: string;
  description: string;
  address: string;
  price: number;
  capacity: number;
  amenities: string[];
  pictures: string[];
} 