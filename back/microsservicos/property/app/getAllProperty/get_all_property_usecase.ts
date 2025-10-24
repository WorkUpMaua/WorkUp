import { PropertyRepository } from "../../shared/domain/repo/propertyRepository"

export class GetAllPropertyUsecase {

    constructor(private repo: PropertyRepository) {}

    public execute(userID: string) {

        const userProperties = this.repo.getAllProperty(userID)

        return userProperties

    }


}