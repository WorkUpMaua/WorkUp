import { UnifiedCatalogo } from "./interfaces"

export type BookingsType = {
    catalogID: string
    bookingID: string
    userID: string
    startTime: number
    endTime: number
}

export interface getAllDisponibilidadeProps {
  startTime?: number;
  endTime?: number;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
}

export type getDisponbilidadeProps = Pick<UnifiedCatalogo, 'id'> & Pick<BookingsType, 'startTime' | 'endTime'>

export type createDisponibilidadeProps = Omit<UnifiedCatalogo, 'confirmedBookings' >

export type updateDisponibilidadeProps = Omit<UnifiedCatalogo, 'confirmedBookings' >

export type createBookingProps = Pick<UnifiedCatalogo, 'id'> & BookingsType

export type updateBookingProps = Pick<UnifiedCatalogo, 'id'> & BookingsType

export type DeleteBookingProps = Pick<UnifiedCatalogo, 'id'> & Pick<BookingsType, 'bookingID'>