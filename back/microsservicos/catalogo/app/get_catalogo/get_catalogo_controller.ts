import { GetAllCatalogoUsecase } from "../get_all_catalogo/get_all_catalogo_usecase";
import { Request, Response } from 'express'

export class GetCatalogoController {

    constructor(private usecase: GetAllCatalogoUsecase) {}

    public handle(req: Request, res: Response): void {

        

    }

}