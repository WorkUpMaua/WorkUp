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

            if(body.userID === undefined) throw new Error('O campo ID do usuário deve ser informado')
            if (body.name === undefined) throw new Error('Missing catalogo name')
            if (body.description === undefined) throw new Error('Missing catalogo description')
            if (body.address === undefined) throw new Error('Missing catalogo address')
            if (body.comodities === undefined) throw new Error('Missing catalogo comodities')
            if (body.pictures === undefined) throw new Error('Missing catalogo pictures')
            if (body.price === undefined) throw new Error('Missing catalogo price')
            if (body.capacity === undefined) throw new Error('Missing catalogo capacity')
    
            const roomProps = body as Catalogo

            const createdRoom = this.usecase.execute(roomProps)

            const catalogoCreatedEvent: CatalogoEvent = {
                eventType: CatalogoEventNames.CatalogoCreated,
                payload: {
                    userID: body.userID,
                    ...createdRoom
                }
            }

            const published = await publishEvent("catalogo.created", catalogoCreatedEvent)

            if(published) {
                res.status(201).json({
                    room: createdRoom,
                    message: 'The room was created'
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