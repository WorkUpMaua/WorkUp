import { AluguelType } from "../../shared/types";
import { AluguelRepositoryMock } from "../../shared/repo/aluguelRepositoryMock";

export class CreateAluguelUsecase {

    constructor(private repo: AluguelRepositoryMock) {}

    public execute(props: AluguelType): AluguelType {
        const currentTime = Date.now();

        const aluguel: AluguelType = {
            ...props,
            createdAt: currentTime,
            updatedAt: currentTime,
        };

        const createdAluguel = this.repo.createAluguel(aluguel);

        return createdAluguel;
    }
}