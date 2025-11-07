import { AluguelType } from "../../shared/types";
import { AluguelRepositoryMock } from "../../shared/repo/aluguelRepositoryMock";

export class CreateAluguelUsecase {

    constructor(private repoAluguel: AluguelRepositoryMock) {}

    public execute(props: AluguelType): AluguelType {

        const createdAluguel = this.repoAluguel.createAluguel(props);

        return createdAluguel;
    }
}