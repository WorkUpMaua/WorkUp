import { CatalogoRepositoryMock, CatalogoType } from "../../repo/catalogoRepositoryMock";

export class CreateCatalogoUsecase {

    constructor(private repo: CatalogoRepositoryMock) {}

    public execute(props: CatalogoType) {

        const room = this.repo.createCatalogo(props)

        return room

    }

}