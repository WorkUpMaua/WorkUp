import { GetAllAluguelUsecase } from "./get_all_aluguel_usecase";
import { Request, Response } from 'express'

export class GetAllAluguelController {

    constructor(private usecase: GetAllAluguelUsecase) {}

    public handle(req: Request, res: Response): void {

        try {

            const alugueis = this.usecase.execute()

            res.status(200).json({
                alugueis,
                "message": "Os alugueis foram recuperados"
            });

        } catch (err) {
            res.status(500).json({
                "message": err
            })
        }

    }

}