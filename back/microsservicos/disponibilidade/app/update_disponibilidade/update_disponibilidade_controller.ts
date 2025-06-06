import { updateDisponibilidadeProps } from "../../shared/types";
import { UpdateDisponibilidadeUsecase } from "./update_disponibilidade_usecase";
import { Request, Response } from "express";

export class UpdateDisponibilidadeController {
  constructor(private usecase: UpdateDisponibilidadeUsecase) {}

  public async handler(req: Request, res: Response) {
    try {

        const { id } = req.params

        const { name, address, comodities, pictures, price, capacity } = req.body

        if(!id) throw new Error('O campo id deve ser definido')

        const props: updateDisponibilidadeProps = {
            id,
            name,
            address,
            comodities,
            pictures,
            price,
            capacity
        }

        const updated_disponibilidade = this.usecase.execute(props)

        res.json({
            room: updated_disponibilidade,
            message: 'A sala foi atualizada com sucesso'
        })

    } catch (err) {
      res.status(500).json({
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
