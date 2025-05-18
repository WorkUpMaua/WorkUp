import { CatalogoRepositoryMock, updateCatalogoProps } from "../../repo/catalogoRepositoryMock";

export class UpdateCatalogoUsecase {

    constructor(private repo: CatalogoRepositoryMock) {}

    public execute(props: updateCatalogoProps) {

        const room_updated = this.repo.updateCatalogo(props)

        return room_updated

    }

}