import { CatalogoRepository } from "../../shared/domain/repo/catalogoRepository"
import { updateCatalogoProps } from "../../shared/domain/types"


export class UpdateCatalogoUsecase {

    constructor(private repo: CatalogoRepository) {}

    public execute(props: updateCatalogoProps) {

        const catalogo = this.repo.getCatalogo(props.id)

        if (!catalogo) throw new Error('ID não encontrado')

        const room_updated = this.repo.updateCatalogo(props)

        return room_updated

    }

}