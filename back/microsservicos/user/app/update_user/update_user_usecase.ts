import { userInfoValidation } from "../../shared/domain/validations/userInfoValidation";
import { updateUserPropsType } from "../../shared/domain/validations/types";
import { UserRepository } from "../../shared/domain/repo/userRepository";

export class UpdateUserUsecase {
  constructor(private repo: UserRepository) {}

  public execute(props: updateUserPropsType) {

    if(props.cpf && !userInfoValidation.validateCPF(props.cpf)) throw new Error("Campo CPF inválido")

    if(props.birth && !userInfoValidation.validateBirth(props.birth)) throw new Error("Campo nascimento deve ter mais de 18 anos")

    if((props.phone) && !userInfoValidation.validatePhone(props.phone)) throw new Error("Campo telefone inválido")

    const user_info = this.repo.updateUser(props)

    return user_info

  }
}
