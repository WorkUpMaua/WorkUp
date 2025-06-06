import { PropertyRepositoryMock } from "../../shared/repo/propertyRepositoryMock";

export class GetPropertyUsecase {

    constructor(private repo: PropertyRepositoryMock) {}

    public execute(userID: string, catalogID: string) {

        const catalog = this.repo.getProperty(userID, catalogID)

        return catalog

    }


}