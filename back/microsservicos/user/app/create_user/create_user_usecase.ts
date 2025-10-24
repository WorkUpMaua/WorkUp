import { userInfoValidation } from "../../shared/domain/validations/userInfoValidation";
import { UserRepository } from "../../shared/domain/repo/userRepository";
import { createUserPropsType } from "../../shared/domain/validations/types";

export class CreateUserUsecase {
  constructor(private repo: UserRepository) {}

  public execute(props: createUserPropsType) {
    if (!userInfoValidation.validateEmail(props.auth.username))
      throw new Error("Field email is invalid");

    if (!userInfoValidation.validateCPF(props.information.cpf))
      throw new Error("Field cpf is invalid");

    if (!userInfoValidation.validateBirth(props.information.birth))
      throw new Error("Field birth must be over 18 years old");

    if (!userInfoValidation.validatePhone(props.information.phone))
      throw new Error("Field phone is invalid");

    const user_info = this.repo.createUser(props);

    return user_info;
  }
}
