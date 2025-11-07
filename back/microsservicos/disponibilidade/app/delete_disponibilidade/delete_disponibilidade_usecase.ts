import { DisponibilidadeRepository } from "../../shared/domain/repo/disponibilidadeRepository";

export class DeleteDisponibilidadeUsecase {

    constructor(private repo: DisponibilidadeRepository) {}

    public execute(id: string) {

        const disponibilidade_deleted = this.repo.deleteDisponibilidade(id)

        return disponibilidade_deleted

    }

}