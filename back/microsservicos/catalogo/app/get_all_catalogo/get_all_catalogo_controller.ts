import { GetAllCatalogoUsecase } from "./get_all_catalogo_usecase";
import { Request, Response } from 'express'

export class GetAllCatalogoController {

    constructor(private usecase: GetAllCatalogoUsecase) {}

    public handle(req: Request, res: Response): void {

        try {

            const rooms = this.usecase.execute()

            res.status(200).json({
                rooms,
                "message": "Todos os catálogos foram encontrados com sucesso"
            });

        } catch (err) {
            res.status(500).json({
                "message": err
            })
        }

    }

}