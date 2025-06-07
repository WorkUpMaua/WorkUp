import { CatalogoRepositoryMock } from "../../shared/repo/catalogoRepositoryMock";

export class GetCatalogoUsecase {

    constructor(private repo: CatalogoRepositoryMock) {}

    public exectute(id: string) {
        
        const room = this.repo.getCatalogo(id)

        if(!room) throw new Error('Catálogo não encontrado')

        return room

    }

}