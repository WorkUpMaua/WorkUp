import { AluguelRepositoryMock } from "../../shared/repo/aluguelRepositoryMock";

export class GetAllAluguelUsecase {

    constructor(private repo: AluguelRepositoryMock) {}

    public execute() {
        return this.repo.getAllAluguel()
    }

}