import { Request, Response } from "express";
import { GetCatalogoUsecase } from "./get_catalogo_usecase";

export class GetCatalogoController {
  constructor(private usecase: GetCatalogoUsecase) {}

  public handle(req: Request, res: Response): void {
    try {
      const { id } = req.params;

      if (id === undefined) throw new Error("ID do catálogo não informado");

      const room = this.usecase.exectute(id);

      res.json(room);
    } catch (err) {
        res.status(500).json({
            message: err instanceof Error ? err.message : String(err)
        })
    }
  }
}
