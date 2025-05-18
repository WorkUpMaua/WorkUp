import axios from "axios";
import { updateCatalogoProps } from "../../repo/catalogoRepositoryMock";
import { UpdateCatalogoUsecase } from "./update_catalogo_usecase";
import { Request, Response } from 'express'

export class UpdateCatalogoController {

    constructor(private usecase: UpdateCatalogoUsecase) {}

    public async handle(req: Request, res: Response): Promise<void> {

        try {

            const body = req.body

            if (body.id === undefined) throw new Error('Missing room id')

            const props = body as updateCatalogoProps

            const room_updated = this.usecase.execute(props)

            // manda para o barramento de eventos
            await axios.post('http://localhost:10001/events', {
                type: 'CatalogoUpdated',
                payload: props
            })
            .then()
            .catch( (err) => { throw err })
            .finally( () => res.json(room_updated) )

        } catch (err) {
            res.status(500).json({
                message: err instanceof Error ? err.message : String(err)
            })
        }

    }

}