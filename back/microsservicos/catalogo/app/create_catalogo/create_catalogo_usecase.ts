import { Catalogo } from "../../shared/interfaces";
import { CatalogoRepositoryMock } from "../../shared/repo/catalogoRepositoryMock";

export class CreateCatalogoUsecase {

    constructor(private repo: CatalogoRepositoryMock) {}

    public execute(props: Catalogo) {

        const room = this.repo.createCatalogo(props)

        return room

    }

}