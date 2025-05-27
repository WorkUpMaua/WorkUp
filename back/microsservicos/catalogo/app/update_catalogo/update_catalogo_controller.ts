import axios from "axios";
import { Request, Response } from 'express'
import { UpdateCatalogoUsecase } from "./update_catalogo_usecase";
import { updateCatalogoProps } from "../../shared/types";

export class UpdateCatalogoController {

    constructor(private usecase: UpdateCatalogoUsecase) {}

    public handle(req: Request, res: Response): void {

        try {

            const id = req.params.id;

            if (id === undefined) throw new Error('ID não informado')
            if (id.length !== 36) throw new Error('ID inválido')

            const props: updateCatalogoProps = { id, ...req.body };

            const room_updated = this.usecase.execute(props)

            // manda para o barramento de eventos
            axios.post('http://localhost:10001/events', {
                type: 'CatalogoUpdated',
                payload: room_updated
            })
            .then()
            .catch( (err) => console.log(err))
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