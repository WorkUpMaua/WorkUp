export interface Catalogo {
    id: string
    name: string
    description: string
    address: string
    comodities: string[]
    pictures: string[]
    price: number
    capacity: number
    doorCodeHash?: string
}
