import { GetPropertyUsecase } from "./get_property_usecase";
import { Request, Response } from "express";

export class GetPropertyController {
  constructor(private usecase: GetPropertyUsecase) {}

  public handle(req: Request, res: Response): void {
    try {
      const { user_id, catalog_id } = req.query;

      if (!user_id) throw new Error("O campo userID deve ser informado");
      if (!catalog_id) throw new Error("O campo catalogID deve ser informado");
        
      const room = this.usecase.execute(user_id as string, catalog_id as string);

      res.json({
            room,
            message: 'A propriedade do usuário foi retornada'
        })

    } catch (err) {
      res.status(500).json({
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
