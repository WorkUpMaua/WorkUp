import axios from "axios";
import crypto from "crypto";
import { Request, Response } from 'express'
import { UpdateCatalogoUsecase } from "./update_catalogo_usecase";
import { updateCatalogoProps } from "../../shared/domain/types";
import { CatalogoEvent } from "../../shared/infra/clients/rabbitmq/interfaces";
import { CatalogoEventNames } from "../../shared/infra/clients/rabbitmq/enums";
import { publishEvent } from "../../shared/infra/clients/rabbitmq/rabbitmq";

export class UpdateCatalogoController {

    constructor(private usecase: UpdateCatalogoUsecase) {}

    public async handle(req: Request, res: Response): Promise<void> {

        try {

            const id = req.params.id;

            if (id === undefined) throw new Error('ID não informado')
            if (id.length !== 36) throw new Error('ID inválido')

            const {
                doorCode,
                doorCodeHash: providedDoorCodeHash,
                ...restBody
            } = req.body ?? {};

            let doorCodeHash: string | undefined = providedDoorCodeHash;
            const rawDoorInput: unknown = doorCode ?? providedDoorCodeHash;

            if (rawDoorInput !== undefined) {
                if (typeof rawDoorInput !== "string") {
                    throw new Error("doorCode must be a string");
                }
                const trimmed = rawDoorInput.trim();

                if (/^\d{5}$/.test(trimmed)) {
                    doorCodeHash = crypto.createHash("sha256").update(trimmed).digest("hex");
                } else if (/^[a-f0-9]{64}$/i.test(trimmed)) {
                    doorCodeHash = trimmed.toLowerCase();
                } else {
                    throw new Error("Invalid doorCode format. Provide 5 digits or a SHA-256 hash.");
                }
            }

            const props: updateCatalogoProps = {
                id,
                ...restBody,
                ...(doorCodeHash ? { doorCodeHash } : {}),
            };

            const room_updated = this.usecase.execute(props)

            const catalogoUpdatedEvent: CatalogoEvent = {
                eventType: CatalogoEventNames.CatalogoUpdated,
                payload: {
                    userID: "",
                    ...room_updated
                }
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
