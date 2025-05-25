import { Environments } from "../../environments";
import { LoginUserController } from "./login_user_controller";
import { LoginUserUsecase } from "./login_user_usecase";

const repo = Environments.instance.repo
const usecase = new LoginUserUsecase(repo)
export const loginUserController = new LoginUserController(usecase)