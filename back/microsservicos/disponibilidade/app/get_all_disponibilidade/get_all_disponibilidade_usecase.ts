import { getAllDisponibilidadeProps } from "../../shared/domain/types";
import { DisponibilidadeRepository } from "../../shared/domain/repo/disponibilidadeRepository";

export class GetAllDisponibilidadeUsecase {

    constructor(private repo: DisponibilidadeRepository) {}

    public execute(props?: getAllDisponibilidadeProps) {

        if(props) {

            if(props.startTime! >= props.endTime!) throw new Error('O campo startTime deve ser sempre menor que o endTime')
        }

        return this.repo.getAllDisponibilidade(props)

    }

}