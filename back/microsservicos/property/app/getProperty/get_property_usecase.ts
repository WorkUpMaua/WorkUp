import { PropertyRepository } from "../../shared/domain/repo/propertyRepository";
import { PropertyRepositoryMock } from "../../shared/infra/repo/propertyRepositoryMock";

export class GetPropertyUsecase {

    constructor(private repo: PropertyRepository) {}

    public execute(userID: string, catalogID: string) {

        const catalog = this.repo.getProperty(userID, catalogID)

        return catalog

    }


}