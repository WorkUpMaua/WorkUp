import { CreateCatalogoUsecase } from "./create_catalogo_usecase";
import { Request, Response } from "express";
import { Catalogo } from "../../shared/interfaces";
import path from "path";
import fs from "fs";

import { updateCatalogoUsecase } from "../update_catalogo/update_catalogo_presenter";
import { updateCatalogoProps } from "../../shared/types";
import { CatalogoEvent } from "../../shared/clients/rabbitmq/interfaces";
import { CatalogoEventNames } from "../../shared/clients/rabbitmq/enums";
import { publishEvent } from "../../shared/clients/rabbitmq/rabbitmq";

export class CreateCatalogoController {
    constructor(private usecase: CreateCatalogoUsecase) {}

    public async handle(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body;

            if (body.userID === undefined)
                throw new Error("O campo ID do usuário deve ser informado");
            if (body.name === undefined)
                throw new Error("Missing catalogo name");
            if (body.description === undefined)
                throw new Error("Missing catalogo description");
            if (body.address === undefined)
                throw new Error("Missing catalogo address");
            if (body.comodities === undefined)
                throw new Error("Missing catalogo comodities");
            // if (body.pictures === undefined)
            //     throw new Error("Missing catalogo pictures");
            if (body.price === undefined)
                throw new Error("Missing catalogo price");
            if (body.capacity === undefined)
                throw new Error("Missing catalogo capacity");

            const roomProps = {
                ...body, 
                comodities: Array.isArray(body.comodities)
                    ? body.comodities
                    : body.comodities
                    ? [body.comodities]
                    : [], 
                pictures: []
            } as Catalogo;

            const createdRoom = this.usecase.execute(roomProps);

            // const uploadDir = path.resolve(
            //     __dirname,
            //     "../../../../uploads",
            //     body.userID,
            //     createdRoom.id
            // );
            // fs.mkdirSync(uploadDir, { recursive: true });

            // const files = req.files as Express.Multer.File[];
            // const savedPaths = files.map((file) => {
            //     const filename = `${Date.now()}-${file.originalname}`;
            //     const fullPath = path.join(uploadDir, filename);
            //     fs.writeFileSync(fullPath, file.buffer);
            //     return `uploads/${body.userID}/${createdRoom.id}/${filename}`;
            // });

            // const roomWithUpdatedPaths = updateCatalogoUsecase.execute({
            //     id: createdRoom.id,
            //     pictures: savedPaths,
            // });

            const catalogoCreatedEvent: CatalogoEvent = {
                eventType: CatalogoEventNames.CatalogoCreated,
                payload: {
                    userID: body.userID,
                    // ...roomWithUpdatedPaths,
                    ...createdRoom
                },
            };

            const published = await publishEvent(
                "catalogo.created",
                catalogoCreatedEvent
            );

            if (published) {
                res.status(201).json({
                    room: createdRoom,
                    message: "The room was created",
                });
            } else {
                throw new Error(
                    "Could not publish the event: " +
                        JSON.stringify(catalogoCreatedEvent)
                );
            }
        } catch (err) {
            res.status(500).json({
                message: err instanceof Error ? err.message : String(err),
            });
        }
    }
}
