import { UserRepository } from "../../shared/domain/repo/userRepository";
import { authType } from "../../shared/domain/validations/types";

export class LoginUserUsecase {

    constructor(private repo: UserRepository) {}

    public execute(props: authType) {

        const id = this.repo.loginUser(props)

        return id

    }

}