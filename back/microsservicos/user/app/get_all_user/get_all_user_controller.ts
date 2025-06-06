import { GetAllUserUsecase } from "./get_all_user_usecase";
import { Request, Response } from 'express';

export class GetAllUserController {

    constructor(private usecase: GetAllUserUsecase) {}

    public handle(req: Request, res: Response): void {

        try {

            const users = this.usecase.execute()

            res.json({
                users,
                message: 'Todos os usuários foram encontrados com sucesso'
            })

        } catch (err) {
            res.status(500).json({
                message: err instanceof Error ? err.message : String(err)
            })
        }

    }

}