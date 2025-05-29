import { createDisponibilidadeProps } from "../../shared/types";
import { CreateDisponibilidadeUsecase } from "./create_disponibilidade_usecase";
import { Request, Response } from "express";

export class CreateDisponibilidadeController {
  constructor(private usecase: CreateDisponibilidadeUsecase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;

      if (body.name === undefined)
        throw new Error("O campo name deve ser definido");
      if (body.address === undefined)
        throw new Error("O campo address deve ser definido");
      if (body.comodities === undefined)
        throw new Error("O campo comodities deve ser definido");
      if (body.pictures === undefined)
        throw new Error("O campo pictures deve ser definido");
      if (body.price === undefined)
        throw new Error("O campo price deve ser definido");
      if (body.capacity === undefined)
        throw new Error("O campo capacity deve ser definido");

      const props: createDisponibilidadeProps = {
        name: body.name as string,
        address: body.address as string,
        comodities: body.comodities as string[],
        pictures: body.pictures as string[],
        price: Number(body.price),
        capacity: Number(body.capacity),
      };

      const createdDisponibilidade = this.usecase.execute(props)

      /**
       * @todo mandar para o barramento de eventos
       */

      res.status(201).json({
        room: createdDisponibilidade,
        message: 'A sala foi criada'
      })

    } catch (err) {
      res.status(500).json({
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
