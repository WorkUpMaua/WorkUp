import { DisponibilidadeRepositoryMock } from "../../shared/repo/disponibilidadeRepositoryMock";
import { updateDisponibilidadeProps } from "../../shared/types";

export class UpdateDisponibilidadeUsecase {

    constructor(private repo: DisponibilidadeRepositoryMock) {}

    public execute(props: updateDisponibilidadeProps) {

        const updated_disponibilidade = this.repo.updateDisponibilidade(props)

        return updated_disponibilidade

    }

}