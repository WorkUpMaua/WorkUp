import { PropertyRepositoryMock } from "../../shared/repo/propertyRepositoryMock";
import { CatalogoType } from "../../shared/types";

export class CreatePropertyUsecase {

    constructor(private repo: PropertyRepositoryMock) {}

    public execute(userID: string, catalog: CatalogoType) {

        const roomCreated = this.repo.createProperty(userID, catalog)

        return roomCreated

    }   

}