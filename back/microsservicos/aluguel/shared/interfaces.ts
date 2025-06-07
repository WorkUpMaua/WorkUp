export interface Aluguel {
    id: string
    userId: string
    workspaceId: string
    startDate: number
    endDate: number
    finalPrice: number
    capacity: number
    status: "PENDING" | "CONFIRMED" | "CANCELED"
    createdAt: number
    updatedAt: number
}