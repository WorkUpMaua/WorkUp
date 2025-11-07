import { getDisponbilidadeProps } from "../../shared/domain/types";
import { GetDisponibilidadeUsecase } from "./get_disponibilidade_usecase";
import { Request, Response } from 'express'

export class GetDisponibilidadeController {

    constructor(private usecase: GetDisponibilidadeUsecase) {}

    public handle(req: Request, res: Response): void {

        try {

            const { id } = req.params
            const { startDate, endDate } = req.query

            if(!id) throw new Error('O campo id deve ser definido')
            if(!startDate) throw new Error('O campo startDate deve ser definido')
            if(!endDate) throw new Error('O campo endDate deve ser definido')

            const props: getDisponbilidadeProps = {
                id,
                startTime: Number(startDate),
                endTime: Number(endDate)
            }

            const availableSpots = this.usecase.execute(props)

            res.json({
                availableSpots,
                message: availableSpots > 0 ? 'A sala está disponível' : 'Não existem mais lugares'
            })

        } catch (err) {
            res.status(500).json({
                "message": err instanceof Error ? err.message : String(err)
            })
        }

    }

}