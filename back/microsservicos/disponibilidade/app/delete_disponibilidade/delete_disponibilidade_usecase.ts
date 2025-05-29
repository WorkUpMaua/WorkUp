import { DisponibilidadeRepositoryMock } from "../../shared/repo/disponibilidadeRepositoryMock";

export class DeleteDisponibilidadeUsecase {

    constructor(private repo: DisponibilidadeRepositoryMock) {}

    public execute(id: string) {

        const disponibilidade_deleted = this.repo.deleteDisponibilidade(id)

        return disponibilidade_deleted

    }

}