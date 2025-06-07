import { PropertyRepositoryMock } from "../../shared/repo/propertyRepositoryMock";

export class CreatePropertyManagementUsecase {

    constructor(private repo: PropertyRepositoryMock) {}

    public execute(userID: string) {

        const userPropertyManagementCreated = this.repo.createPropertyManagement(userID)

        return userPropertyManagementCreated

    }

}