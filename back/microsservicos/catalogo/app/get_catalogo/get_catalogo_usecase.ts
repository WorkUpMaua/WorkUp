import { CatalogoRepositoryMock } from "../../repo/catalogoRepositoryMock";

export class GetCatalogoUsecase {

    constructor(private repo: CatalogoRepositoryMock) {}

    public exectute(id: string) {
        
        const room = this.repo.getCatalogo(id)

        return room

    }

}