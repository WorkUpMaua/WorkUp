import { CatalogoRepositoryMock } from "../../repo/catalogoRepositoryMock";

export class CreateCatalogoUsecase {

    constructor(private repo: CatalogoRepositoryMock) {}

    public exectute(id: string) {
        
        const room = this.repo.getCatalogo(id)

        return room

    }

}