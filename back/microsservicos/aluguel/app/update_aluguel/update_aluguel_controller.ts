import axios from "axios";
import { Request, Response } from 'express'
import { UpdateAluguelUsecase } from "./update_aluguel_usecase";
import { updateAluguelProps } from "../../shared/types";

export class UpdateAluguelController {

    constructor(private usecase: UpdateAluguelUsecase) {}

    public handle(req: Request, res: Response): void {

        try {

            const id = req.params.id;
            const typesStatus = ["PENDING", "CONFIRMED", "CANCELED"];

            if (id === undefined) throw new Error('ID não informado')
            if (id.length !== 36) throw new Error('ID inválido')
            if (!typesStatus.includes(req.body.status)) throw new Error('Status inválido')

            const props: updateAluguelProps = { id, ...req.body };

            const aluguelUpdated = this.usecase.execute(props)

            // manda para o barramento de eventos
            axios.post('http://localhost:10001/events', {
                type: 'AluguelUpdated',
                payload: props
            })
            .then()
            .catch( (err) => console.log(err))
            .finally( () => res.json({
                "aluguel": aluguelUpdated,
                "message": "A reserva foi atualizada com sucesso!"
            }) )

        } catch (err) {
            res.status(500).json({
                message: err instanceof Error ? err.message : String(err)
            })
        }

    }

}