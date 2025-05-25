import { Environments } from "../../environments";
import { CreateUserController } from "./create_user_controller";
import { CreateUserUsecase } from "./create_user_usecase";

const repo = Environments.instance.repo
const usecase = new CreateUserUsecase(repo)
export const createUserController = new CreateUserController(usecase)