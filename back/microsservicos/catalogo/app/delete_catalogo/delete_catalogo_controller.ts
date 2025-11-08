import axios from 'axios'
import { Request, Response } from 'express'
import { DeleteCatalogoUsecase } from "./delete_catalogo_usecase"
import { CatalogoEvent } from '../../shared/infra/clients/rabbitmq/interfaces';
import { CatalogoEventNames } from '../../shared/infra/clients/rabbitmq/enums';
import { publishEvent } from '../../shared/infra/clients/rabbitmq/rabbitmq';


export class DeleteCatalogoController {

    constructor(private usecase: DeleteCatalogoUsecase) {}
    
    public async handle(req: Request, res: Response): Promise<void> {
        
        try {

            const id = req.params.id;
            const userID = req.body?.userID as string | undefined;

            if (!id) throw new Error('ID não informado')
            if (id.length !== 36) throw new Error('ID inválido')
            if (!userID) throw new Error('O campo userID deve ser informado')

            const deletedCatalogo = this.usecase.execute(id)

            const catalogoDeletedEvent: CatalogoEvent = {
                eventType: CatalogoEventNames.CatalogoDeleted,
                payload: {
                    userID,
                    ...deletedCatalogo
                }
            }
        
            const published = await publishEvent("catalogo.deleted", catalogoDeletedEvent)

            if(published) {
                res.json({
                    room: deletedCatalogo,
                    message: 'The room was deleted'
                })
            } else {
                throw new Error('Could not publish the event: ' + JSON.stringify(catalogoDeletedEvent))
            }

        } catch (err) {
            res.status(500).json({
                "message": err instanceof Error ? err.message : String(err)
            })
        } 
        
    }
    
}
