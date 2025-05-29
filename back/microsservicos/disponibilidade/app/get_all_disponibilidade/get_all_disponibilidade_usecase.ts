import { DisponibilidadeRepositoryMock } from "../../shared/repo/disponibilidadeRepositoryMock";
import { getAllDisponibilidadeType } from "../../shared/types";

export class GetAllDisponibilidadeUsecase {

    constructor(private repo: DisponibilidadeRepositoryMock) {}

    public execute(props?: getAllDisponibilidadeType) {

        if(props) {

            if(props.startTime >= props.endTime) throw new Error('O campo startTime deve ser sempre menor que o endTime')
        }

        return this.repo.getAllDisponibilidade(props)

    }

}