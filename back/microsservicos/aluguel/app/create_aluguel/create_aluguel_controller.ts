import { AluguelType } from "@aluguel/shared/types";
import { CreateAluguelUsecase } from "./create_aluguel_usecase";
import { Request, Response } from "express";
import axios from "axios";

export class CreateAluguelController {
    
    constructor(private usecase: CreateAluguelUsecase) {}

    public handle(req: Request, res: Response): void {

        try {

            const body = req.body;

            if (body.userId === undefined) throw new Error('Missing user ID');
            if (body.workspaceId === undefined) throw new Error('Missing workspace ID');
            if (body.startDate === undefined) throw new Error('Missing start date');
            if (body.endDate === undefined) throw new Error('Missing end date');
            if (body.capacity === undefined) throw new Error('Missing capacity');
            

            // const aluguelProps: AluguelType = {
            //     id: '',
            //     userId: body.userId as string,
            //     workspaceId: body.workspaceId as string,
            //     finalPrice: 0, // Será calculado no usecase
            //     status: "PENDING", // Status inicial
            //     createdAt: 0, // Será atualizado no usecase
            //     updatedAt: 0, // Será atualizado no usecase
            //     startDate: body.startDate as number,
            //     endDate: body.endDate as number,
            //     capacity: body.capacity as number
            // };

            const aluguelProps = body as AluguelType;

            const createdAluguel = this.usecase.execute(aluguelProps);

            // manda para o barramento de eventos
            axios.post('http://localhost:10001/events', {
                type: 'AluguelCreated',
                payload: createdAluguel
            })
            .then()
            .catch((err) => console.log(err))
            .finally(() => res.status(201).json({
                createdAluguel,
                message: 'O aluguel foi criado com sucesso'
            }));

        } catch (err) {
            res.status(500).json({
                message: err instanceof Error ? err.message : String(err)
            });
        }

    }
}