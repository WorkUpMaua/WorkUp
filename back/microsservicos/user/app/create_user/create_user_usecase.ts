import { createUserPropsType, UserRepositoryMock } from "../../shared/repo/userRepositoryMock";

import { userInfoValidation } from "../../shared/validations/userInfoValidation";

export class CreateUserUsecase {
  constructor(private repo: UserRepositoryMock) {}

  public execute(props: createUserPropsType) {
    if (!userInfoValidation.validateEmail(props.auth.username))
      throw new Error("Campo email inválido");

    if (!userInfoValidation.validateCPF(props.information.cpf))
      throw new Error("Campo CPF inválido");

    if (!userInfoValidation.validateBirth(props.information.birth))
      throw new Error("O usuário deve ter mais de 18 anos");

    if (!userInfoValidation.validatePhone(props.information.phone))
      throw new Error("Campo telefone inválido");

    const user_info = this.repo.createUser(props);

    return user_info;
  }
}
