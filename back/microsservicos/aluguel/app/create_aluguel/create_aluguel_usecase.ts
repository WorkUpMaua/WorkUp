import { Aluguel } from "../../shared/interfaces"
import { AluguelRepositoryMock } from "../../shared/repo/aluguelRepositoryMock";

export class CreateAluguelUsecase {

    constructor(private repoAluguel: AluguelRepositoryMock) {}

    public execute(props: Aluguel): Aluguel {

        const createdAluguel = this.repoAluguel.createAluguel(props);

        return createdAluguel;
    }
}