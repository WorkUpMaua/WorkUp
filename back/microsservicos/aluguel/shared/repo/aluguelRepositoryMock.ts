import { AluguelType, updateAluguelProps } from "../types"

type baseAluguelType = { 
    [key: string]: AluguelType
}

export class AluguelRepositoryMock {
    
    private baseAluguel: baseAluguelType = {}

    public getAllAluguel(): baseAluguelType {
        return this.baseAluguel
    }

    public getAluguel(id: string): AluguelType {
        return this.baseAluguel[id]
    }

    public createAluguel(props: AluguelType): AluguelType {

        const id = props.id || crypto.randomUUID()

        const aluguel: AluguelType = {
            id,
            userId: props.userId,
            workspaceId: props.workspaceId,
            startDate: props.startDate,
            endDate: props.endDate,
            finalPrice: props.finalPrice,
            capacity: props.capacity,
            status: props.status || "PENDING",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

        this.baseAluguel[id] = aluguel

        return aluguel

    }

    public updateAluguel(props: updateAluguelProps): AluguelType {

        const aluguel_to_update = this.getAluguel(props.id)

        if (props.startDate) aluguel_to_update.startDate = props.startDate
        if (props.endDate) aluguel_to_update.endDate = props.endDate
        if (props.finalPrice) aluguel_to_update.finalPrice = props.finalPrice
        if (props.capacity) aluguel_to_update.capacity = props.capacity
        if (props.status) aluguel_to_update.status = props.status

        aluguel_to_update.updatedAt = Date.now()

        return aluguel_to_update
        
    }

    public deleteAluguel(id: string): AluguelType {
        
        const aluguel_to_delete = this.getAluguel(id)

        delete this.baseAluguel[id]

        return aluguel_to_delete

    }
}