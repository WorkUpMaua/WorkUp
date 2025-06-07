import { CreateCatalogoUsecase } from "./create_catalogo_usecase";
import { Request, Response } from "express";
import { Catalogo } from "../../shared/interfaces";
import path from "path";
import fs from "fs";
import { publishEvent } from "common/rabbitmq";
import { CatalogoEventNames } from "common/enums";
import { CatalogoEvent } from "common/interfaces";

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
            if (body.pictures === undefined)
                throw new Error("Missing catalogo pictures");
            if (body.price === undefined)
                throw new Error("Missing catalogo price");
            if (body.capacity === undefined)
                throw new Error("Missing catalogo capacity");

            const roomProps = {
                pictures: [],
                ...body,
            } as Catalogo

            const uploadDir = path.resolve(
                __dirname,
                "../../../../uploads",
                body.userID,
                roomProps.id
            );
            fs.mkdirSync(uploadDir, { recursive: true });

            const files = req.files as Express.Multer.File[];
            const savedPaths = files.map((file) => {
                const filename = `${Date.now()}-${file.originalname}`;
                const fullPath = path.join(uploadDir, filename);
                fs.writeFileSync(fullPath, file.buffer);
                // aqui você pode salvar o caminho relativo ou absoluto
                return `uploads/${body.userID}/${roomProps.id}/${filename}`;
            });

            /**
             * @todo: Entender como mandar do front -> tela criar propriedade
             */

            roomProps.pictures = savedPaths;

            const createdRoom = this.usecase.execute(roomProps);

            const catalogoCreatedEvent: CatalogoEvent = {
                eventType: CatalogoEventNames.CatalogoCreated,
                payload: {
                    userID: body.userID,
                    ...createdRoom,
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
