import { CatalogoRepository } from "../../shared/domain/repo/catalogoRepository";

export class GetCatalogoUsecase {

    constructor(private repo: CatalogoRepository) {}

    public exectute(id: string) {
        
        const room = this.repo.getCatalogo(id)

        if(!room) throw new Error('ID não encontrado')

        return room

    }

}