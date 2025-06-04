import { DeleteDisponibilidadeUsecase } from "./delete_disponibilidade_usecase";
import{ Request, Response } from 'express'


export class DeleteDisponibilidadeController {

    constructor(private usecase: DeleteDisponibilidadeUsecase) {}

    public async handle(req: Request, res: Response) {

        try {

            const { id } = req.params

            if(!id) throw new Error("O campo id precisa ser definido")

            const deleted_disponibilidade = this.usecase.execute(id)

            res.json({
                room: deleted_disponibilidade,
                message: 'A sala foi deletada'
            })
        } catch (err) {
            res.status(500).json({
                message: err instanceof Error ? err.message : String(err)
            })
        }

    }

}