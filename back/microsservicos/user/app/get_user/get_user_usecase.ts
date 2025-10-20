import { informationType } from "../../shared/domain/validations/types";
import { UserRepository } from "../../shared/domain/repo/userRepository";


export class GetUserUsecase {
  constructor(private repo: UserRepository) {}

  private validateID(id: string): boolean {
    const uuidV4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4Regex.test(id);
  }

  public execute(id: string): informationType {

    if(!this.validateID(id)) throw new Error('Field id is invalid')

    const user = this.repo.getUser(id)

    return user

  }
}
