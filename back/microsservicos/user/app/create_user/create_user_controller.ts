import { Request, Response } from 'express'

import { CreateUserUsecase } from "./create_user_usecase";
import { authType, createUserPropsType } from '../../shared/repo/userRepositoryMock';
import axios from 'axios';
import { informationWithoutID } from '../../shared/types';
import { publishEvent } from 'common';
import { UserEvent } from 'common/interfaces';
import { UserEventNames } from 'common/enums';


export class CreateUserController {

    constructor(private usecase: CreateUserUsecase) {}

    public async handle(req: Request, res: Response): Promise<void> {

        try {

            const body = req.body

            if(body.username === undefined) throw new Error('Usuário não informado')
            if(body.password === undefined) throw new Error('Senha não informada')
            if(body.name === undefined) throw new Error('nome do usuário não informado')
            if(body.cpf === undefined) throw new Error('CPF do usuário não informado')
            if(body.birth === undefined) throw new Error('Data de nascimento do usuário não informada')
            if(body.phone === undefined) throw new Error('Telefone do usuário não informado')

            const auth: authType = {
                username: body.username as string,
                password: body.password as string
            }

            const information: informationWithoutID = {
                name: body.name as string,
                cpf: body.cpf as string,
                email: body.username as string,
                birth: body.birth as number,
                phone: body.phone as string
            }

            const userProps: createUserPropsType = {
                auth,
                information
            }

            const createdUser = this.usecase.execute(userProps)

            const userCreatedEvent: UserEvent = {
                eventType: UserEventNames.UserCreated,
                payload: createdUser
            }

            const published = await publishEvent("user.created", userCreatedEvent)   
            
            if(published) {
                res.status(201).json({
                    user: createdUser,
                    message: 'O usuário foi criado'
                })
            } else {
                throw new Error('Could not publish the event: ' + JSON.stringify(userCreatedEvent))
            }

        } catch (err) {
            res.status(500).json({
                message: err instanceof Error ? err.message : String(err)
            })
        }

    }

}