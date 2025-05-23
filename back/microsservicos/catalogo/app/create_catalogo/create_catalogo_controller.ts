import { CatalogoType } from "../../repo/catalogoRepositoryMock";
import { CreateCatalogoUsecase } from "./create_catalogo_usecase";
import { Request, Response } from 'express'
import axios from 'axios'

export class CreateCatalogoController {

    constructor(private usecase: CreateCatalogoUsecase) {}

    public async handle(req: Request, res: Response): Promise<void> {

        try {

            const body = req.body

            if (body.name === undefined) throw new Error('Missing catalogo name')
            if (body.description === undefined) throw new Error('Missing catalogo description')
            if (body.address === undefined) throw new Error('Missing catalogo address')
            if (body.comodities === undefined) throw new Error('Missing catalogo comodities')
            if (body.pictures === undefined) throw new Error('Missing catalogo pictures')
            if (body.price === undefined) throw new Error('Missing catalogo price')
            if (body.capacity === undefined) throw new Error('Missing catalogo capacity')
    
            const roomProps = body as CatalogoType

            const createdRoom = this.usecase.execute(roomProps)

            // manda para o barramento de eventos
            await axios.post('http://localhost:10001/events', {
                type: 'CatalogoCreated',
                payload: roomProps
            })
            .then()
            .catch( (err) => { throw err } )
            .finally(() => res.status(201).json(createdRoom))

        } catch (err) {
            res.status(500).json({
                message: err instanceof Error ? err.message : String(err)
            })
        }

    } 

}