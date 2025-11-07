import {
  authType,
  createUserPropsType,
  getAllUserReturnType,
  informationType,
  updateUserPropsType,
} from '../../domain/validations/types';
import { User } from '../validations/interfaces';

export type baseUserType = {
  [key: string]: User;
};

export interface UserRepository {
  getAllUser(): getAllUserReturnType;

  getUser(id: string): informationType;

  loginUser(props: authType): string | undefined;

  createUser(props: createUserPropsType): informationType;

  updateUser(props: updateUserPropsType): informationType;

  deleteUser(id: string): informationType;
}
