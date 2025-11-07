import { createDisponibilidadeProps } from "../../shared/domain/types";
import { DisponibilidadeRepository } from "../../shared/domain/repo/disponibilidadeRepository";

export class CreateDisponibilidadeUsecase {

    constructor(private repo: DisponibilidadeRepository) {}

    public execute(props: createDisponibilidadeProps) {

        const new_disponibilidade = this.repo.createDisponibilidade(props)

        return new_disponibilidade

    }

}