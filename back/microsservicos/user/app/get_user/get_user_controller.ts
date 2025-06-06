import { GetUserUsecase } from "./get_user_usecase";
import { Request, Response } from 'express'

export class GetUserController {

    constructor(private usecase: GetUserUsecase) {}

    public handle(req: Request, res: Response): void {
        
        try {

            const { id } = req.params

            if (id === undefined) throw new Error('Missing user id') 
                           
            const user = this.usecase.execute(id as string)

            res.json({
                user,
                message: 'The user was retrieved'
            })
            
        } catch (err) {
            res.status(500).json({
                message: err instanceof Error ? err.message : String(err)
            })
        }

    }

}