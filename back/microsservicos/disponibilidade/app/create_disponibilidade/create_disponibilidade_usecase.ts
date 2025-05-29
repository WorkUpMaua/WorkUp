import { DisponibilidadeRepositoryMock } from "../../shared/repo/disponibilidadeRepositoryMock";
import { createDisponibilidadeProps } from "../../shared/types";

export class CreateDisponibilidadeUsecase {

    constructor(private repo: DisponibilidadeRepositoryMock) {}

    public execute(props: createDisponibilidadeProps) {

        const new_disponibilidade = this.repo.createDisponibilidade(props)

        return new_disponibilidade

    }

}