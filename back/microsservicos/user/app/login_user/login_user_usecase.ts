import { authType, UserRepositoryMock } from "../../repo/userRepositoryMock";

export class LoginUserUsecase {

    constructor(private repo: UserRepositoryMock) {}

    public execute(props: authType) {

        const id = this.repo.loginUser(props)

        return id

    }

}