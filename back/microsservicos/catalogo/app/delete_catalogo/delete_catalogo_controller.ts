import { DeleteCatalogoUsecase } from "./delete_catalogo_usecase"
import { Request, Response } from 'express'
import axios from 'axios'

export class DeleteCatalogoController {

    constructor(private usecase: DeleteCatalogoUsecase) {}
    
    public async handle(request: Request, response: Response): Promise<void> {
        
        try {

            const id = request.params.id;

            if (!id) throw new Error('ID não informado')
            if (id.length !== 36) throw new Error('ID inválido')

            const deletedCatalogo = this.usecase.execute(id)

            if (!deletedCatalogo) throw new Error('ID não encontrado')

            // manda para o barramento de eventos
            await axios.post('http://localhost:10001/events', {
                type: 'CatalogoDeleted',
                payload: deletedCatalogo
            })
            .then()
            .catch( (err) => { throw err } )
            .finally(() => response.status(200).json({
                "room": deletedCatalogo,
                "message": "A sala foi deletada com sucesso!"
            }))
        
        } catch (err) {
            response.status(500).json({
                "message": err instanceof Error ? err.message : String(err)
            })
        } 
        
    }
    
}