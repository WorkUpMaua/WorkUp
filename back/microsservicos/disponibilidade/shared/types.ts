import { UnifiedCatalogo } from "./interfaces"

export type BookingsType = {
    bookingID: string
    userID: string
    startTime: number
    endTime: number
}

export type getAllDisponibilidadeType = Pick<BookingsType, 'startTime' | 'endTime'>

export type createDisponibilidadeProps = Omit<UnifiedCatalogo, 'id' | 'confirmedBookings' >