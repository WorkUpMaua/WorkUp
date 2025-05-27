import { Environments } from "../../environments";
import { GetUserController } from "./get_user_controller";
import { GetUserUsecase } from "./get_user_usecase";

const repo = Environments.instance.repo
const usecase = new GetUserUsecase(repo)
export const getUserController = new GetUserController(usecase)