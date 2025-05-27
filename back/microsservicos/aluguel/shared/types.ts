export type AluguelType = {
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

export type updateAluguelProps = Pick<AluguelType, "id"> & Partial<Omit<AluguelType, "id" | "userId" | "workspaceId" | "createdAt" | "updatedAt">>