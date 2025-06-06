import { CreateCatalogoUsecase } from "./create_catalogo_usecase";
import { Request, Response } from 'express'
import { Catalogo } from "../../shared/interfaces";


import { publishEvent } from 'common/rabbitmq'
import { CatalogoEventNames } from "common/enums";
import { CatalogoEvent } from 'common/interfaces'

export class CreateCatalogoController {

    constructor(private usecase: CreateCatalogoUsecase) {}

    public async handle(req: Request, res: Response): Promise<void> {

        try {

            const body = req.body

            if (body.name === undefined) throw new Error('Nome do catálogo não informado')
            if (body.description === undefined) throw new Error('Descrição do catálogo não informada')
            if (body.address === undefined) throw new Error('Endereço do catálogo não informado')
            if (body.comodities === undefined) throw new Error('Comodidades do catálogo não informadas')
            if (body.pictures === undefined) throw new Error('Fotos do catálogo não informadas')
            if (body.price === undefined) throw new Error('Preço do catálogo não informado')
            if (body.capacity === undefined) throw new Error('Capacidade do catálogo não informada')
    
            const roomProps = body as Catalogo

            const createdRoom = this.usecase.execute(roomProps)

            const catalogoCreatedEvent: CatalogoEvent = {
                eventType: CatalogoEventNames.CatalogoCreated,
                payload: createdRoom
            }

            const published = await publishEvent("catalogo.created", catalogoCreatedEvent)

            if(published) {
                res.status(201).json({
                    room: createdRoom,
                    message: 'O catálogo foi criado com sucesso',
                })
            } else {
                throw new Error('Could not publish the event: ' + JSON.stringify(catalogoCreatedEvent))
            }

        } catch (err) {
            res.status(500).json({
                message: err instanceof Error ? err.message : String(err)
            })
        }

    } 

}