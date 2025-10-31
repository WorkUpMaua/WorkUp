import { v4 as uuidv4 } from 'uuid';

import { CatalogoRepository } from '../../domain/repo/catalogoRepository';
import { Catalogo } from '../../domain/interfaces';
import { updateCatalogoProps } from '../../domain/types';


type baseCatalogoType = { 
    [key: string]: Catalogo 
}
export class CatalogoRepositoryMock implements CatalogoRepository {

    private baseCatalogo: baseCatalogoType = {}

    public getAllCatalogo(): baseCatalogoType {
        return this.baseCatalogo
    }

    public getCatalogo(id: string): Catalogo | undefined {
        return this.baseCatalogo[id]
    }

    public createCatalogo(props: Catalogo): Catalogo {

        const id = uuidv4()

        const room: Catalogo = {
            id,
            name: props.name,
            description: props.description,
            address: props.address,
            comodities: props.comodities,
            pictures: props.pictures,
            price: props.price,
            capacity: props.capacity,
            doorCodeHash: props.doorCodeHash
        }

        this.baseCatalogo[id] = room

        return room

    }

    public updateCatalogo(props: updateCatalogoProps): Catalogo {

        const room_to_update = this.getCatalogo(props.id)

        if (!room_to_update) {
            throw new Error(`Catalogo with id "${props.id}" not found.`)
        }

        if(props.name) room_to_update.name = props.name
        if(props.description) room_to_update.description = props.description
        if(props.address) room_to_update.address = props.address
        if(props.comodities) room_to_update.comodities = props.comodities
        if(props.pictures && props.pictures.length > 0) room_to_update.pictures = props.pictures
        if(props.price) room_to_update.price = props.price
        if(props.capacity) room_to_update.capacity = props.capacity
        if(props.doorCodeHash) room_to_update.doorCodeHash = props.doorCodeHash
        
        return room_to_update
        
    }

    public deleteCatalogo(id: string): Catalogo {
        
        const room_to_delete = this.getCatalogo(id)

        if (!room_to_delete) {
            throw new Error(`Catalogo with id "${id}" not found.`)
        }

        delete this.baseCatalogo[id]

        return room_to_delete

    }

}
