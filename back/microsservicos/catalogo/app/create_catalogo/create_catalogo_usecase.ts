import { Catalogo } from "../../shared/domain/interfaces";
import { CatalogoRepository } from "../../shared/domain/repo/catalogoRepository";

export class CreateCatalogoUsecase {

    constructor(private repo: CatalogoRepository) {}

    public execute(props: Catalogo) {

        const room = this.repo.createCatalogo(props)

        return room

    }

}