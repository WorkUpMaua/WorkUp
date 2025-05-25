import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { User } from "../interfaces";
import { authType, createUserPropsType, getAllUserReturnType, informationType, updateUserPropsType } from "../types";


type baseUserType = {
  [key: string]: User;
};

export class UserRepositoryMock {
  private baseUser: baseUserType = {};

  private encryptPass(pass: string): string {
    const saltRounds = 8;
    const hash = bcrypt.hashSync(pass, saltRounds);
    return hash;
  }

  private comparePass(pass: string, hash: string): boolean {
    return bcrypt.compareSync(pass, hash);
  }

  private doesUserExistsByUsername(username: string): User | undefined {
    return Object.values(this.baseUser).find(
      (user) => user.auth.username === username
    );  
  }

  private doesUserExistsByID(id: string): boolean{
    return Object.values(this.baseUser).some(
      (user) => user.information.id === id
    );
  }

  public getAllUser(): getAllUserReturnType {
    const users_info: getAllUserReturnType = {};

    for (const user of Object.values(this.baseUser)) {
      users_info[user.information.id] = user.information;
    }

    return users_info;
  }

  public getUser(id: string): informationType {

    if(!this.doesUserExistsByID(id)) throw new Error("User not found")

    return this.baseUser[id].information;
  }

  public loginUser(props: authType): string | undefined {

    const user = this.doesUserExistsByUsername(props.username)

    if (!user) throw new Error("Invalid credentials");

    if (this.comparePass(props.password, user.auth.password))
      return user.information.id;
    else
      throw new Error("Invalid credentials")
  }

  public createUser(props: createUserPropsType): informationType {
    const id = uuidv4();

    if (this.doesUserExistsByUsername(props.auth.username))
      throw new Error("User already exists");

    const auth: authType = {
      username: props.auth.username,
      password: this.encryptPass(props.auth.password),
    };

    const information: informationType = {
      id,
      name: props.information.name,
      email: props.information.email,
      cpf: props.information.cpf,
      birth: props.information.birth,
      phone: props.information.phone,
    };

    const user: User = {
      auth,
      information,
    };

    this.baseUser[id] = user;

    return information;
  }

  public updateUser(props: updateUserPropsType): informationType {

    if(!this.doesUserExistsByID(props.id)) throw new Error("User not found")

    const user_to_updade = this.baseUser[props.id];

    if (props.name) user_to_updade.information.name = props.name;
    if (props.cpf) user_to_updade.information.cpf = props.cpf;
    if (props.birth) user_to_updade.information.birth = props.birth;
    if (props.phone) user_to_updade.information.phone = props.phone;

    return user_to_updade.information;
  }

  public deleteUser(id: string): informationType {

    if(!this.doesUserExistsByID(id)) throw new Error("User not found")

    const user_to_delete = this.getUser(id)

    delete this.baseUser[id]

    return user_to_delete

  }
}
export { authType, createUserPropsType };

