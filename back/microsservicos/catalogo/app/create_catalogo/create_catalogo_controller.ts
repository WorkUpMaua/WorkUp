import { CreateCatalogoUsecase } from "./create_catalogo_usecase";
import { Request, Response } from "express";
import { Catalogo } from "../../shared/interfaces";
import { updateCatalogoUsecase } from "../update_catalogo/update_catalogo_presenter";
import { CatalogoEvent } from "../../shared/clients/rabbitmq/interfaces";
import { CatalogoEventNames } from "../../shared/clients/rabbitmq/enums";
import { publishEvent } from "../../shared/clients/rabbitmq/rabbitmq";
import { uploadCatalogoPictures } from "../../shared/clients/s3/uploadPictures";

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
      if (body.price === undefined)
        throw new Error("Missing catalogo price");
      if (body.capacity === undefined)
        throw new Error("Missing catalogo capacity");

      const price =
        typeof body.price === "string" ? Number(body.price) : body.price;
      const capacity =
        typeof body.capacity === "string" ? Number(body.capacity) : body.capacity;

      const comodities = Array.isArray(body.comodities)
        ? body.comodities
        : body.comodities
        ? [body.comodities]
        : [];

      const roomProps = {
        ...body,
        comodities,
        pictures: [],
        price,
        capacity,
      } as Catalogo;

      const createdRoom = this.usecase.execute(roomProps);

      let roomWithUpdatedPaths = createdRoom;

      const files = (req.files as Express.Multer.File[]) || [];

      
      if (files.length > 0) {
        const savedPaths = await uploadCatalogoPictures(createdRoom.id, files);

        console.log({
          id: createdRoom.id,
          pictures: savedPaths, 
        })

        roomWithUpdatedPaths = updateCatalogoUsecase.execute({
          id: createdRoom.id,
          pictures: savedPaths, 
        });
    }

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
          room: roomWithUpdatedPaths,
          message: "The room was created",
        });
      } else {
        throw new Error(
          "Could not publish the event: " + JSON.stringify(catalogoCreatedEvent)
        );
      }
    } catch (err) {
      res.status(500).json({
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
