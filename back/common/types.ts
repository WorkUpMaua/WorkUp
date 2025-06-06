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