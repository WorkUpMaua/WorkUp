import axios from "axios";
import { updateCatalogoProps } from "../../repo/catalogoRepositoryMock";
import { UpdateCatalogoUsecase } from "./update_catalogo_usecase";
import { Request, Response } from 'express'

export class UpdateCatalogoController {

    constructor(private usecase: UpdateCatalogoUsecase) {}

    public async handle(req: Request, res: Response): Promise<void> {

        try {

            const id = req.params.id;

            if (id === undefined) throw new Error('ID não informado')
            if (id.length !== 36) throw new Error('ID inválido')

            const props: updateCatalogoProps = { id, ...req.body };

            const room_updated = this.usecase.execute(props)

            // manda para o barramento de eventos
            await axios.post('http://localhost:10001/events', {
                type: 'CatalogoUpdated',
                payload: props
            })
            .then()
            .catch( (err) => { throw err })
            .finally( () => res.json({
                "room": room_updated,
                "message": "A sala foi atualizada com sucesso!"
            }) )

        } catch (err) {
            res.status(500).json({
                message: err instanceof Error ? err.message : String(err)
            })
        }

    }

}