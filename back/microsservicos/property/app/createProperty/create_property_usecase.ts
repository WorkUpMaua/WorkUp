import { CatalogoType } from "../../shared/domain/types";
import { PropertyRepository } from "../../shared/domain/repo/propertyRepository";

export class CreatePropertyUsecase {

    constructor(private repo: PropertyRepository) {}

    public execute(userID: string, catalog: CatalogoType) {

        const roomCreated = this.repo.createProperty(userID, catalog)

        return roomCreated

    }   

}