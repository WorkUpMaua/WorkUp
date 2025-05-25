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
