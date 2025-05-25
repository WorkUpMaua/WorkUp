import { validate } from "uuid";
import { UserRepositoryMock } from "../../shared/repo/userRepositoryMock";
import { updateUserPropsType } from "../../shared/types/Routes";
import { userInfoValidation } from "../../shared/validations/userInfoValidation";

export class UpdateUserUsecase {
  constructor(private repo: UserRepositoryMock) {}

  public execute(props: updateUserPropsType) {

    if(props.cpf && !userInfoValidation.validateCPF(props.cpf)) throw new Error("Field user CPF is invalid")

    if(props.birth && !userInfoValidation.validateBirth(props.birth)) throw new Error("Field user birth must be over 18 years old")

    if((props.birth) && !userInfoValidation.validateBirth(props.birth)) throw new Error("Field user phone is invalid")

    const user_info = this.repo.updateUser(props)

    return user_info

  }
}
