import { UserRepositoryMock } from "../../repo/userRepositoryMock";

export class GetAllUserUsecase {

    constructor(private repo: UserRepositoryMock) {}

    public execute() {
        return this.repo.getAllUser()
    }

}