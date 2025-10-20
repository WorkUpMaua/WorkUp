import { userInfoValidation } from "../../shared/domain/validations/userInfoValidation";
import { updateUserPropsType } from "../../shared/domain/validations/types";
import { UserRepository } from "../../shared/domain/repo/userRepository";

export class UpdateUserUsecase {
  constructor(private repo: UserRepository) {}

  public execute(props: updateUserPropsType) {

    if(props.cpf && !userInfoValidation.validateCPF(props.cpf)) throw new Error("Field user CPF is invalid")

    if(props.birth && !userInfoValidation.validateBirth(props.birth)) throw new Error("Field user birth must be over 18 years old")

    if((props.birth) && !userInfoValidation.validateBirth(props.birth)) throw new Error("Field user phone is invalid")

    const user_info = this.repo.updateUser(props)

    return user_info

  }
}
