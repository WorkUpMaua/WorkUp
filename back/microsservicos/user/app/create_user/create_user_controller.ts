import { Request, Response } from 'express'

import { CreateUserUsecase } from "./create_user_usecase";
import { authType, createUserPropsType, informationWithoutID, informationType } from '../../repo/userRepositoryMock';
import axios from 'axios';

export class CreateUserController {

    constructor(private usecase: CreateUserUsecase) {}

    public async handle(req: Request, res: Response): Promise<void> {

        try {

            const body = req.body

            if(body.username === undefined) throw new Error('Missing user username')
            if(body.password === undefined) throw new Error('Missing user password')
            if(body.name === undefined) throw new Error('Missing user name')
            if(body.email === undefined) throw new Error('Missing user email')
            if(body.cpf === undefined) throw new Error('Missing user cpf')
            if(body.birth === undefined) throw new Error('Missing user birth')
            if(body.phone === undefined) throw new Error('Missing user phone')

            const auth: authType = {
                username: body.username as string,
                password: body.password as string
            }

            const information: informationWithoutID = {
                name: body.name as string,
                email: body.email as string,
                cpf: body.cpf as string,
                birth: body.birth as number,
                phone: body.phone as string
            }

            const userProps: createUserPropsType = {
                auth,
                information
            }

            const createdUser = this.usecase.execute(userProps)

            // manda para o barramento de eventos
            await axios.post('http://localhost:10001/events', {
                type: 'UserCreated',
                payload: createdUser
            })
            .then()
            .catch( (err) => { throw err } )
            .finally(() => res.status(201).json({
                createdUser,
                message: 'The user was created'
            }))

        } catch (err) {
            res.status(500).json({
                message: err instanceof Error ? err.message : String(err)
            })
        }

    }

}