import { UnifiedCatalogo } from "../../shared/interfaces";
import { getAllDisponibilidadeProps } from "../../shared/types";
import { GetAllDisponibilidadeUsecase } from "./get_all_disponibilidade_usecase";
import { Request, Response } from "express";

export class GetAllDisponibilidadeController {
  constructor(private usecase: GetAllDisponibilidadeUsecase) {}

  public handle(req: Request, res: Response): void {
    try {
      const { startDate, endDate } = req.query;

      let catalogs = {};

      if ((!startDate && endDate) || (startDate && !endDate))
        throw new Error("Os campos startDate e endDate devem vir juntos");

      if (!startDate && !endDate) {
        catalogs = this.usecase.execute();
      } else {
        const props: getAllDisponibilidadeProps = {
          startTime: Number(startDate),
          endTime: Number(endDate),
        };

        catalogs = this.usecase.execute(props);
      }

      // mandar para o barramento de eventos

      res.json({
        rooms: catalogs,
        message: 'As salas foram retornadas'
      })

    } catch (err) {
      res.status(500).json({
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
