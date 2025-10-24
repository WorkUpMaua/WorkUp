import { PropertyRepository } from "../../shared/domain/repo/propertyRepository";

export class CreatePropertyManagementUsecase {

    constructor(private repo: PropertyRepository) {}

    public execute(userID: string) {

        const userPropertyManagementCreated = this.repo.createPropertyManagement(userID)

        return userPropertyManagementCreated

    }

}