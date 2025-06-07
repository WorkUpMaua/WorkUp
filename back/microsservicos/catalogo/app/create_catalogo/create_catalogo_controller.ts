import { CreateCatalogoUsecase } from "./create_catalogo_usecase";
import { Request, Response } from "express";
import { Catalogo } from "../../shared/interfaces";
import path from "path";
import fs from "fs";
import { publishEvent } from "common/rabbitmq";
import { CatalogoEventNames } from "common/enums";
import { CatalogoEvent } from "common/interfaces";
import { updateCatalogoUsecase } from "../update_catalogo/update_catalogo_presenter";
import { updateCatalogoProps } from "../../shared/types";

export class CreateCatalogoController {
    constructor(private usecase: CreateCatalogoUsecase) {}

    public async handle(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body;

            if (body.name === undefined) throw new Error('Nome do catálogo não informado')
            if (body.description === undefined) throw new Error('Descrição do catálogo não informada')
            if (body.address === undefined) throw new Error('Endereço do catálogo não informado')
            if (body.comodities === undefined) throw new Error('Comodidades do catálogo não informadas')
            if (body.pictures === undefined) throw new Error('Fotos do catálogo não informadas')
            if (body.price === undefined) throw new Error('Preço do catálogo não informado')
            if (body.capacity === undefined) throw new Error('Capacidade do catálogo não informada')
    
            const roomProps = body as Catalogo

            const createdRoom = this.usecase.execute(roomProps);

            const uploadDir = path.resolve(
                __dirname,
                "../../../../uploads",
                body.userID,
                createdRoom.id
            );
            fs.mkdirSync(uploadDir, { recursive: true });

            const files = req.files as Express.Multer.File[];
            const savedPaths = files.map((file) => {
                const filename = `${Date.now()}-${file.originalname}`;
                const fullPath = path.join(uploadDir, filename);
                fs.writeFileSync(fullPath, file.buffer);
                return `uploads/${body.userID}/${createdRoom.id}/${filename}`;
            });

            const roomWithUpdatedPaths = updateCatalogoUsecase.execute({
                id: createdRoom.id,
                pictures: savedPaths,
            });

            const catalogoCreatedEvent: CatalogoEvent = {
                eventType: CatalogoEventNames.CatalogoCreated,
                payload: {
                    userID: body.userID,
                    ...roomWithUpdatedPaths,
                },
            };

            const published = await publishEvent(
                "catalogo.created",
                catalogoCreatedEvent
            );

            if (published) {
                res.status(201).json({
                    room: createdRoom,
                    message: 'O catálogo foi criado com sucesso',
                })
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
