import axios from 'axios'
import { Request, Response } from 'express'
import { DeleteAluguelUsecase } from "./delete_aluguel_usecase"

export class DeleteAluguelController {

    constructor(private usecase: DeleteAluguelUsecase) {}
    
    public handle(request: Request, response: Response): void {
        
        try {

            const id = request.params.id;

            if (!id) throw new Error('ID não informado')
            if (id.length !== 36) throw new Error('ID inválido')

            const deletedAluguel = this.usecase.execute(id)

            // manda para o barramento de eventos
            axios.post('http://localhost:10001/events', {
                type: 'AluguelDeleted',
                payload: deletedAluguel
            })
            .then()
            .catch( (err) => console.log(err) )
            .finally(() => response.status(200).json({
                "room": deletedAluguel,
                "message": "A reserva foi deletada com sucesso!"
            }))
        
        } catch (err) {
            response.status(500).json({
                "message": err instanceof Error ? err.message : String(err)
            })
        } 
        
    }
    
}