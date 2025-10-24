import { DisponibilidadeRepositoryMock } from "../../shared/infra/repo/disponibilidadeRepositoryMock";
import { updateDisponibilidadeProps } from "../../shared/domain/types";
import { DisponibilidadeRepository } from "../../shared/domain/repo/disponibilidadeRepository";

export class UpdateDisponibilidadeUsecase {

    constructor(private repo: DisponibilidadeRepository) {}

    public execute(props: updateDisponibilidadeProps) {

        const updated_disponibilidade = this.repo.updateDisponibilidade(props)

        return updated_disponibilidade

    }

}