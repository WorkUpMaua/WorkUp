import { v4 as uuidv4 } from 'uuid';

export type CatalogoType = {
    id: string
    name: string
    description: string
    address: string
    comodities: string[]
    pictures: string[]
    price: number
}

type baseCatalogoType = { 
    [key: string]: CatalogoType 
}
export class CatalogoRepositoryMock {

    private baseCatalogo: baseCatalogoType = {}

    public getAllCatalogo(): baseCatalogoType {
        return this.baseCatalogo
    }

    public getCatalogo(id: string): CatalogoType {
        return this.baseCatalogo[id]
    }

    public createCatalogo(props: CatalogoType): CatalogoType {

        const id = uuidv4()

        const room: CatalogoType = {
            id,
            name: props.name,
            description: props.description,
            address: props.address,
            comodities: props.comodities,
            pictures: props.pictures,
            price: props.price
        }

        this.baseCatalogo[id] = room

        return room

    }

}