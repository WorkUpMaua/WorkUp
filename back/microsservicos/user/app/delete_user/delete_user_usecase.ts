import { UserRepository } from "../../shared/domain/repo/userRepository";

export class DeleteUserUsecase {

    constructor (private repo: UserRepository) {}

    public execute(id: string) {

        const user_deleted = this.repo.deleteUser(id)

        return user_deleted

    }

}