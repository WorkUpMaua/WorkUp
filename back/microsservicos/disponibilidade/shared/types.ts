import { UnifiedCatalogo } from "./interfaces"

export type BookingsType = {
    bookingID: string
    userID: string
    startTime: number
    endTime: number
}

export type getAllDisponibilidadeProps = Pick<BookingsType, 'startTime' | 'endTime'>

export type getDisponbilidadeProps = Pick<UnifiedCatalogo, 'id'> & Pick<BookingsType, 'startTime' | 'endTime'>

export type createDisponibilidadeProps = Omit<UnifiedCatalogo, 'id' | 'confirmedBookings' >