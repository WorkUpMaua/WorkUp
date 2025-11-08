import { userInfoValidation } from "../../shared/domain/validations/userInfoValidation";
import { UserRepository } from "../../shared/domain/repo/userRepository";
import { createUserPropsType } from "../../shared/domain/validations/types";

export class CreateUserUsecase {
  constructor(private repo: UserRepository) {}

  public execute(props: createUserPropsType) {
    if (!userInfoValidation.validateEmail(props.auth.username))
      throw new Error("Campo e-mail inválido");

    if (!userInfoValidation.validateCPF(props.information.cpf))
      throw new Error("Campo CPF inválido");

    if (!userInfoValidation.validateBirth(props.information.birth))
      throw new Error("Campo nascimento deve ter mais de 18 anos");

    if (!userInfoValidation.validatePhone(props.information.phone))
      throw new Error("Campo telefone inválido");

    const user_info = this.repo.createUser(props);

    return user_info;
  }
}
