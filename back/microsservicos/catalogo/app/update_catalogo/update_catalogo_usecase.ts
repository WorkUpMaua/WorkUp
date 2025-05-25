import { CatalogoRepositoryMock } from "../../shared/repo/catalogoRepositoryMock";
import { updateCatalogoProps } from "../../shared/types";

export class UpdateCatalogoUsecase {

    constructor(private repo: CatalogoRepositoryMock) {}

    public execute(props: updateCatalogoProps) {

        const catalogo = this.repo.getCatalogo(props.id)

        if (!catalogo) throw new Error('ID não encontrado')

        const room_updated = this.repo.updateCatalogo(props)

        return room_updated

    }

}