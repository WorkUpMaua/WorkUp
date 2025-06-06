import { PropertyRepositoryMock } from "../../shared/repo/propertyRepositoryMock"



export class GetAllPropertyUsecase {

    constructor(private repo: PropertyRepositoryMock) {}

    public execute(userID: string) {

        const userProperties = this.repo.getAllProperty(userID)

        return userProperties

    }


}