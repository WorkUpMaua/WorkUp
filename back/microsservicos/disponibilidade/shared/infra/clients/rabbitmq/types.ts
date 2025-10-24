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

export type BookingsType = {
  bookingID: string
  userID: string
  workSpaceID: string
  startTime: number
  endTime: number
  people: number
  finalPrice: number
  status: string
  createdAt: number
  updatedAt: number
}