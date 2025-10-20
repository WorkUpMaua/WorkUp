import { getDisponbilidadeProps } from "../../shared/domain/types";
import { DisponibilidadeRepository } from "../../shared/domain/repo/disponibilidadeRepository";

export class GetDisponibilidadeUsecase {

    constructor(private repo: DisponibilidadeRepository) {}

    public execute(props: getDisponbilidadeProps) {

        if(props.startTime >= props.endTime) throw new Error('O campo startTime deve ser sempre menor que o endTime')

        const availableSpots = this.repo.getDisponibilidade(props)

        return availableSpots

    }

}