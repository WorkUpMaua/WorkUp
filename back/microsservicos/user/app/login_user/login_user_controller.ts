import { authType } from "../../shared/repo/userRepositoryMock";
import { LoginUserUsecase } from "./login_user_usecase";
import { Request, Response } from 'express'

export class LoginUserController {

    constructor(private usecase: LoginUserUsecase) {}

    public handle(req: Request, res: Response): void {

        try {

            const body = req.body

            if(body.username === undefined) throw new Error('Missing user username')
            if(body.password === undefined) throw new Error('Missing user password')

            const loginProps = body as authType

            const id = this.usecase.execute(loginProps)

            res.json({
                token: id,
                message: 'The user token was retrieved'
            })

        } catch (err) {
            res.status(500).json({
                message: err instanceof Error ? err.message : String(err)
            })
        }

    }

}