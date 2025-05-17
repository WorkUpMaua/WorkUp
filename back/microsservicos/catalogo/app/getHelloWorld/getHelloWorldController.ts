import { Request, Response } from 'express'

class GetHelloWorldController {

    public handle(req: Request, res: Response): void {
        res.json({
            response: 'Hello, World!'
        })
    }

}

export const getHelloWorldController = new GetHelloWorldController()