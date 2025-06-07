import { v4 as uuidv4 } from 'uuid';

import { updateAluguelProps } from "../types"
import { Aluguel } from "../interfaces"

type baseAluguelType = { 
    [key: string]: Aluguel
}

export class AluguelRepositoryMock {
    
    private baseAluguel: baseAluguelType = {}

    public getAllAluguel(): baseAluguelType {
        return this.baseAluguel
    }

    public getAluguel(id: string): Aluguel {
        return this.baseAluguel[id]
    }

    public createAluguel(props: Aluguel): Aluguel {

        const id = uuidv4()
        const currentTime = Date.now();

        const aluguel: Aluguel = {
            id,
            userId: props.userId,
            workspaceId: props.workspaceId,
            startDate: props.startDate,
            endDate: props.endDate,
            finalPrice: props.finalPrice,
            capacity: props.capacity,
            status: props.status || "PENDING",
            createdAt: currentTime,
            updatedAt: currentTime
        }

        this.baseAluguel[id] = aluguel

        return aluguel

    }

    public updateAluguel(props: updateAluguelProps): Aluguel {

        const aluguel_to_update = this.getAluguel(props.id)

        if (props.startDate) aluguel_to_update.startDate = props.startDate
        if (props.endDate) aluguel_to_update.endDate = props.endDate
        if (props.finalPrice) aluguel_to_update.finalPrice = props.finalPrice
        if (props.capacity) aluguel_to_update.capacity = props.capacity
        if (props.status) aluguel_to_update.status = props.status

        aluguel_to_update.updatedAt = Date.now()

        return aluguel_to_update
        
    }

    public deleteAluguel(id: string): Aluguel {
        
        const aluguel_to_delete = this.getAluguel(id)

        delete this.baseAluguel[id]

        return aluguel_to_delete

    }
}