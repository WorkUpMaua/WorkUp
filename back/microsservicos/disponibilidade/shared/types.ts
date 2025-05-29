export type BookingsType = {
    bookingID: string
    userID: string
    startTime: number
    endTime: number
}

export type getAllDisponibilidadeType = Pick<BookingsType, 'startTime' | 'endTime'>