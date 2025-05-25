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

export type getAllUserReturnType = { [key: string]: informationType };

// Deixa o id opcional e o resto obrigatorio
export type informationWithoutID = Omit<informationType, "id"> &
  Partial<Pick<informationType, "id">>;

export type createUserPropsType = {
  auth: authType;
  information: informationWithoutID;
};

// Deixa o id obrigatorio e o resto opcional, com excessao do email
export type updateUserPropsType = Pick<informationType, "id"> &
  Partial<Omit<informationType, "id" | "email">>;
