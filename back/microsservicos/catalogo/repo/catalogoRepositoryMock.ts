import { v4 as uuidv4 } from 'uuid';

export type CatalogoType = {
    id: string
    name: string
    description: string
    address: string
    comodities: string[]
    pictures: string[]
    price: number
    capacity: number
}

// Deixa id obrigatoria e o resto opcional
export type updateCatalogoProps = Pick<CatalogoType, 'id'> & Partial<Omit<CatalogoType, 'id'>>

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
            price: props.price,
            capacity: props.capacity
        }

        this.baseCatalogo[id] = room

        return room

    }

    public updateCatalogo(props: updateCatalogoProps): CatalogoType {

        const room_to_update = this.getCatalogo(props.id)

        if(props.name) room_to_update.name = props.name
        if(props.description) room_to_update.description = props.description
        if(props.address) room_to_update.address = props.address
        if(props.comodities) room_to_update.comodities = props.comodities
        if(props.pictures && props.pictures.length > 0) room_to_update.pictures = props.pictures
        if(props.price) room_to_update.price = props.price
        if(props.capacity) room_to_update.capacity = props.capacity
        
        return room_to_update
        
    }

    public deleteCatalogo(id: string): CatalogoType {
        
        const room_to_delete = this.getCatalogo(id)

        delete this.baseCatalogo[id]

        return room_to_delete

    }

}