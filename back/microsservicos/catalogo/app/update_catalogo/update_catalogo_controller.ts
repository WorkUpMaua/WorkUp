import axios from "axios";
import { Request, Response } from 'express'
import { UpdateCatalogoUsecase } from "./update_catalogo_usecase";
import { updateCatalogoProps } from "../../shared/types";
import { publishEvent } from "common";

import { CatalogoEventNames } from "common/enums";
import { CatalogoEvent } from "common/interfaces";

export class UpdateCatalogoController {

    constructor(private usecase: UpdateCatalogoUsecase) {}

    public async handle(req: Request, res: Response): Promise<void> {

        try {

            const id = req.params.id;

            if (id === undefined) throw new Error('ID não informado')
            if (id.length !== 36) throw new Error('ID inválido')

            const props: updateCatalogoProps = { id, ...req.body };

            const room_updated = this.usecase.execute(props)

            const catalogoUpdatedEvent: CatalogoEvent = {
                eventType: CatalogoEventNames.CatalogoUpdated,
                payload: room_updated
            }

            const published = await publishEvent("catalogo.updated", catalogoUpdatedEvent)

            if(published) {
                res.json({
                    room: room_updated,
                    message: 'The room was updated'
                })
            } else {
                throw new Error('Could not publish the event: ' + JSON.stringify(catalogoUpdatedEvent))
            }

        } catch (err) {
            res.status(500).json({
                message: err instanceof Error ? err.message : String(err)
            })
        }

    }

}