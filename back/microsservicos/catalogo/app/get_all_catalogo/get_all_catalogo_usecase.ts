import { CatalogoRepository } from "../../shared/domain/repo/catalogoRepository";

export class GetAllCatalogoUsecase {

    constructor(private repo: CatalogoRepository) {}

    public execute() {
        return this.repo.getAllCatalogo()
    }

}