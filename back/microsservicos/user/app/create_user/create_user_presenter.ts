import { Environments } from "../../shared/environments";
import { CreateUserController } from "./create_user_controller";
import { CreateUserUsecase } from "./create_user_usecase";

const repo = Environments.getUserRepository();
const usecase = new CreateUserUsecase(repo)
export const createUserController = new CreateUserController(usecase)