import { PropertyRepository } from "../../shared/domain/repo/propertyRepository";

export class DeletePropertyUsecase {

    constructor(private repo: PropertyRepository) {}

    public execute(userID: string, catalogID: string) {
        const userProperties = this.repo.deleteProperty(userID, catalogID);
        return userProperties;
    }

}
