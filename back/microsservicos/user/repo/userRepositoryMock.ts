import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export type informationType = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  birth: number;
  phone: string;
};

export type authType = {
  username: string;
  password: string;
};

export interface User {
  auth: authType;
  information: informationType;
}

export type getAllUserReturnType = { [key: string]: informationType };

// Deixa o id opcional e o resto obrigatorio
export type informationWithoutID = Omit<informationType, "id"> &
  Partial<Pick<informationType, "id">>;

export type createUserPropsType = {
  auth: authType;
  information: informationWithoutID;
};

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

  private checkDuplicateUser(username: string): boolean {
    return Object.values(this.baseUser).some(
      (user) => user.auth.username === username
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
    return this.baseUser[id].information;
  }

  public createUser(props: createUserPropsType): informationType {
    const id = uuidv4();

    if (this.checkDuplicateUser(props.auth.username))
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
}
