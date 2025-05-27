import { CatalogoRepositoryMock } from "../../shared/repo/catalogoRepositoryMock";

export class GetAllCatalogoUsecase {

    constructor(private repo: CatalogoRepositoryMock) {}

    public execute() {
        return this.repo.getAllCatalogo()
    }

}