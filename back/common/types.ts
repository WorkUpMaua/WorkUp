export type catalogo = {
    userID: string,
    id: string
    name: string
    description: string
    address: string
    comodities: string[]
    pictures: string[]
    price: number
    capacity: number
}

export type userInformation = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  birth: number;
  phone: string;
};

export type aluguel = {
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