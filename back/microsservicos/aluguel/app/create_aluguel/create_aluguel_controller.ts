import { AluguelType } from "../../shared/types";
import { CreateAluguelUsecase } from "./create_aluguel_usecase";
import { Request, Response } from "express";
import axios from "axios";

export class CreateAluguelController {
    
    constructor(private usecase: CreateAluguelUsecase) {}

    public handle(req: Request, res: Response): void {

        try {

            const body = req.body;
            const typesStatus = ["PENDING", "CONFIRMED", "CANCELED"];

            if (body.userId === undefined) throw new Error('ID do usuário não informado');
            if (body.workspaceId === undefined) throw new Error('ID do espaço de trabalho não informado');
            if (body.startDate === undefined) throw new Error('check-in não informado');
            if (body.endDate === undefined) throw new Error('check-out não informado');
            if (body.capacity === undefined) throw new Error('capacidade não informada');
            if (body.finalPrice === undefined) throw new Error('preço final não informado');
            if (req.body.capacity <= 0 || typeof req.body.capacity !== 'number') throw new Error('Capacidade inválida')
            if (req.body.finalPrice <= 0 || typeof req.body.finalPrice !== 'number') throw new Error('Preço final inválido')
            if (req.body.status && !typesStatus.includes(req.body.status)) throw new Error('Status inválido')

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