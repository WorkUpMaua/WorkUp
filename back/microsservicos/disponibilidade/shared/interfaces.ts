import { BookingsType } from "./types";

export interface UnifiedCatalogo {
  id: string;
  name: string;
  address: string;
  comodities: string[];
  pictures: string[];
  price: number;
  capacity: number;
  confirmedBookings: BookingsType[] 
}
