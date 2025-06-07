import { GetAllPropertyUsecase } from "./get_all_property_usecase";
import { Request, Response } from "express";

export class GetAllPropertyController {
  constructor(private usecase: GetAllPropertyUsecase) {}

  public handle(req: Request, res: Response): void {
    try {

        const userID = req.params.id

        if(!userID) throw new Error('O campo userID deve ser definido')

        const userProperties = this.usecase.execute(userID)

        res.json({
          userProperties,
          message: "As propriedades do usuário foram retornadas"
        })
 
    } catch (err) {
      res.status(500).json({
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
