import { UserRepositoryMock } from "../../shared/repo/userRepositoryMock";
import { userInfoValidation } from "../../shared/validations/userInfoValidation";
import { updateUserPropsType } from "../../shared/types";

export class UpdateUserUsecase {
  constructor(private repo: UserRepositoryMock) {}

  public execute(props: updateUserPropsType) {

    if(props.cpf && !userInfoValidation.validateCPF(props.cpf)) throw new Error("O campo CPF do usuário é inválido")

    if(props.birth && !userInfoValidation.validateBirth(props.birth)) throw new Error("O usuário deve ter pelo menos 18 anos")

    if((props.phone) && !userInfoValidation.validatePhone(props.phone)) throw new Error("O campo telefone do usuário é inválido")

    const user_info = this.repo.updateUser(props)

    return user_info

  }
}
