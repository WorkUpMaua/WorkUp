import { Request, Response } from "express";
import { GetAluguelUsecase } from "./get_aluguel_usecase";

export class GetAluguelController {
  constructor(private usecase: GetAluguelUsecase) {}

  public handle(req: Request, res: Response): void {
    try {
      const { id } = req.params;

      if (id === undefined) throw new Error("ID não informado");

      const room = this.usecase.exectute(id);

      res.json(room);
    } catch (err) {
        res.status(500).json({
            message: err instanceof Error ? err.message : String(err)
        })
    }
  }
}
