import { DisponibilidadeRepositoryMock } from "../../shared/repo/disponibilidadeRepositoryMock";
import { getDisponbilidadeProps } from "../../shared/types";

export class GetDisponibilidadeUsecase {

    constructor(private repo: DisponibilidadeRepositoryMock) {}

    public execute(props: getDisponbilidadeProps) {

        if(props.startTime >= props.endTime) throw new Error('O campo startTime deve ser sempre menor que o endTime')

        const availableSpots = this.repo.getDisponibilidade(props)

        return availableSpots

    }

}