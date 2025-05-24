import { createUserPropsType, UserRepositoryMock } from "../../repo/userRepositoryMock";

export class CreateUserUsecase {
  constructor(private repo: UserRepositoryMock) {}

  private validateCPF(cpf: string): boolean {
    const regex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
    return regex.test(cpf);
  }

  private validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  private validatePhone(phone: string): boolean {
    const regex = /^(\+55\s?)?(\(?\d{2}\)?[\s.-]?)?9\d{4}[\s.-]?\d{4}$/;
    return regex.test(phone);
  }

  private validateBirth(birth_timestamp: number) {
    const birthDate = new Date(birth_timestamp);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const hasNotHadBirthdayThisYear =
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate());

    if (hasNotHadBirthdayThisYear) {
      age--;
    }

    return age >= 18;
  }

  public execute(props: createUserPropsType) {
    
    if(!this.validateEmail(props.auth.username)) throw new Error('Field email is invalid')

    if(!this.validateCPF(props.information.cpf)) throw new Error('Field cpf is invalid')

    if(!this.validateBirth(props.information.birth)) throw new Error('Field birth must be over 18 years old')

    if(!this.validatePhone(props.information.phone)) throw new Error('Field phone is invalid')

    const user_info = this.repo.createUser(props)

    return user_info

  }
}
