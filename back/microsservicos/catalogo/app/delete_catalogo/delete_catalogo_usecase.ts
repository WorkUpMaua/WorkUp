import { CatalogoRepositoryMock } from "../../repo/catalogoRepositoryMock"

export class DeleteCatalogoUsecase {
    
    constructor(private repo: CatalogoRepositoryMock) {}
    
    public execute(id: string) {

        const catalogo = this.repo.getCatalogo(id)

        if (!catalogo) throw new Error('ID não encontrado')
        
        const room = this.repo.deleteCatalogo(catalogo.id)
        
        return room
        
    }
    
}