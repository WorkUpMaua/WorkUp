import { UserRepositoryMock } from "../../shared/repo/userRepositoryMock";

export class GetAllUserUsecase {

    constructor(private repo: UserRepositoryMock) {}

    public execute() {
        return this.repo.getAllUser()
    }

}