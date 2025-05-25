import { UserRepositoryMock } from "../../shared/repo/userRepositoryMock";

export class DeleteUserUsecase {

    constructor (private repo: UserRepositoryMock) {}

    public execute(id: string) {

        const user_deleted = this.repo.deleteUser(id)

        return user_deleted

    }

}