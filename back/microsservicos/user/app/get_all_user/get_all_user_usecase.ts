import { UserRepository } from "../../shared/domain/repo/userRepository";

export class GetAllUserUsecase {

    constructor(private repo: UserRepository) {}

    public execute() {
        return this.repo.getAllUser()
    }

}